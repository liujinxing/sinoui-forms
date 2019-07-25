/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, Subject } from 'rxjs';
import { map, debounceTime, mergeMap } from 'rxjs/operators';
import { produce } from 'immer';
import { set, get, memoize } from 'lodash';
import {
  unstable_runWithPriority,
  unstable_NormalPriority,
  unstable_LowPriority,
} from 'scheduler';
import {
  FormStateModel,
  FieldConfig,
  FormStateErrors,
  FieldStateModel,
  FormState,
} from './types';
import isError from '../utils/isError';
import isFunction from '../utils/isFunction';
import calcNewValues from '../utils/calcNewValues';

interface Options<T> {
  validate?: (values: T) => FormStateErrors | undefined;
  onSubmit?: (values: T) => Promise<any> | void;
}

function createSubBehaviorSubject<T, U extends keyof FormStateModel<T>>(
  state$: BehaviorSubject<FormStateModel<T>>,
  key: U,
): BehaviorSubject<FormStateModel<T>[U]> {
  const subState$ = new BehaviorSubject<FormStateModel<T>[U]>(
    state$.value[key],
  );

  state$.pipe(map((state) => state[key])).subscribe(subState$);

  return subState$;
}

const fieldAndFormStateNames: {
  [x: string]: keyof FormStateModel;
} = {
  value: 'values',
  error: 'errors',
  asyncError: 'asyncErrors',
  isPending: 'isPending',
  isTouched: 'isTouched',
};

/**
 * 创建表单状态
 *
 * @param intialValues 表单初始值
 */
function createFormState<T = any>(
  intialValues: T = {} as any,
  options: Options<T> = {},
): FormState<T> {
  const fields: FieldConfig[] = [];
  const formState$ = new BehaviorSubject<FormStateModel<T>>({
    values: intialValues,
    isSubmitting: false,
    errors: {},
    isTouched: {},
    asyncErrors: {},
    isPending: {},
  });

  const values$ = createSubBehaviorSubject(formState$, 'values');
  const errors$ = createSubBehaviorSubject(formState$, 'errors');
  const isTouched$ = createSubBehaviorSubject(formState$, 'isTouched');
  const asyncErrors$ = createSubBehaviorSubject(formState$, 'asyncErrors');
  const isPending$ = createSubBehaviorSubject(formState$, 'isPending');

  /**
   * 更新表单状态
   */
  const updateState = (
    producer: (draft: FormStateModel<T>) => void,
  ): FormStateModel<T> => {
    const newFormState = produce(formState$.value, producer);

    formState$.next(newFormState);

    return newFormState;
  };

  const createUpdateSubStateFn = <U extends keyof FormStateModel<T>>(
    key: U,
  ) => (value: FormStateModel<T>[U]) => {
    const newFormState = produce(
      formState$.value,
      (draft: FormStateModel<T>) => {
        draft[key] = value;
      },
    );

    formState$.next(newFormState);
  };

  const validateForm = () => {
    const { values } = formState$.value;
    const errors = options.validate ? options.validate(values) || {} : {};

    fields.forEach((field) => {
      if (field.validate) {
        const fieldError = field.validate((values as any)[field.name], values);
        if (fieldError) {
          errors[field.name] = fieldError;
        }
      }
    });

    return errors;
  };

  /**
   * 校验表单
   */
  const validate = () => {
    const errors = validateForm();

    formState$.next(
      produce(formState$.value, (draft: FormStateModel<T>) => {
        draft.errors = errors;
      }),
    );

    return !isError(errors);
  };

  /**
   * 重置表单
   */
  const reset = (defaultValues: T = intialValues) => {
    formState$.next(
      produce(formState$.value, (draft: FormStateModel<T>) => {
        draft.values = defaultValues;
        draft.isSubmitting = false;
        draft.errors = {};
        draft.asyncErrors = {};
        draft.isTouched = {};
        draft.isPending = {};
      }),
    );
  };

  const setSubmitting = createUpdateSubStateFn('isSubmitting');

  /**
   * 提交表单
   */
  const submit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event && event.preventDefault && isFunction(event.preventDefault)) {
      event.preventDefault();
    }
    if (event && event.stopPropagation && isFunction(event.stopPropagation)) {
      event.stopPropagation();
    }

    const isValid = validate() && !isError(asyncErrors$.value);

    if (isValid && options.onSubmit) {
      setSubmitting(true);
      try {
        const result = await options.onSubmit(values$.value);
        updateState((draft) => {
          draft.isSubmitting = false;
          draft.isTouched = {};
        });
        return result;
      } catch (e) {
        setSubmitting(false);
        throw e;
      }
    }

    if (!isValid) {
      updateState((draft) => {
        const newTouched = {};
        fields.forEach((field) => {
          set(newTouched, field.name, true);
        });
        draft.isTouched = newTouched;
      });
    }

    return undefined;
  };

  /**
   * 获取表单域状态的可观察对象
   *
   * @param fieldName 表单域名称
   */
  const getFieldState$: any = memoize(<M>(fieldName: string) => {
    const getFieldState = (formState: FormStateModel<T>) => {
      return {
        name: fieldName,
        value: get(formState.values, fieldName) as M,
        error: get(formState.errors, fieldName) as (string | undefined),
        isTouched: get(formState.isTouched, fieldName) as boolean,
        asyncError: get(formState.asyncErrors, fieldName) as (
          | string
          | undefined),
        isPending: get(formState.isPending, fieldName) as boolean,
      };
    };

    const fieldState$ = new BehaviorSubject<FieldStateModel<M>>(
      getFieldState(formState$.value),
    );

    formState$.pipe(map(getFieldState)).subscribe(fieldState$);

    return fieldState$;
  });

  /**
   * 获取表单域状态
   *
   * @param fieldName 表单域名称
   */
  const getFieldState = <M = any>(fieldName: string): FieldStateModel<M> => {
    return getFieldState$(fieldName).value as any;
  };

  /**
   * 设置表单域状态
   */
  const setFieldState = <M>(
    fieldName: string,
    producer: (draft: FieldStateModel<M>) => void,
  ) => {
    const fieldState: any = getFieldState<M>(fieldName);
    const newFieldState: any = produce(fieldState, producer);

    if (newFieldState !== fieldState) {
      updateState((draft) => {
        Object.keys(fieldState)
          .filter((key) => key !== 'name')
          .forEach((key) => {
            const oldValue = fieldState[key];
            const newValue = newFieldState[key];

            if (oldValue !== newValue) {
              set(
                (draft as any)[fieldAndFormStateNames[key]],
                fieldName,
                newValue,
              );
            }
          });
      });
    }
    return newFieldState;
  };

  const asyncValidateActions$ = new Subject<string>();

  /**
   * 异步表单域校验
   */
  asyncValidateActions$
    .pipe(
      debounceTime(500),
      mergeMap(async (fieldName) => {
        const field = fields.find((item) => item.name === fieldName);
        const asyncValidate = field ? field.asyncValidate : undefined;
        if (!field || !asyncValidate) {
          return { error: undefined, fieldName };
        }
        try {
          updateState((draft) => {
            set(draft.isPending, fieldName, true);
          });
          const values = values$.value;
          const error = await asyncValidate((values as any)[fieldName], values);
          return { error, fieldName };
        } catch (e) {
          return { error: undefined, fieldName };
        }
      }),
    )
    .subscribe((result) => {
      unstable_runWithPriority(unstable_LowPriority, () => {
        updateState((draft) => {
          if (!get(draft.errors, result.fieldName)) {
            set(draft.asyncErrors, result.fieldName, result.error);
          }
          set(draft.isPending, result.fieldName, false);
        });
      });
    });

  /**
   * 校验表单域
   */
  const validateField = (fieldName: string) => {
    const errors = validateForm();
    const isFieldError = get(errors, fieldName);

    updateState((draft) => {
      draft.errors = errors;
      if (isFieldError) {
        set(draft.asyncErrors, fieldName, undefined);
        set(draft.isPending, fieldName, false);
      }
    });

    const field = fields.find((item) => item.name === fieldName);
    if (!isFieldError && field && field.asyncValidate) {
      asyncValidateActions$.next(fieldName);
    }
  };

  /**
   * 设置表单域值
   *
   * @param fieldName 表单域名称
   * @param value 表单域值
   */
  const setFieldValue = <M>(fieldName: string, value: M) => {
    updateState((draft) => {
      set(draft.values as any, fieldName, value);
    });

    unstable_runWithPriority(unstable_NormalPriority, () => {
      updateState((draft) => {
        calcNewValues(draft.values, fields as any, fieldName);
      });

      unstable_runWithPriority(unstable_LowPriority, () => {
        validateField(fieldName);
      });
    });
  };

  /**
   * 表单域失去焦点
   */
  const blur = (fieldName: string) => {
    updateState((draft) => {
      set(draft.isTouched, fieldName, true);
    });

    unstable_runWithPriority(unstable_LowPriority, () => {
      validateField(fieldName);
    });
  };

  /**
   * 设置表单域的被点击状态
   */
  const setFieldTouched = (fieldName: string, isTouched = true) => {
    updateState((draft) => {
      set(draft.isTouched, fieldName, isTouched);
    });
  };

  /**
   * 设置表单域验证错误
   */
  const setFieldError = (fieldName: string, error?: string) => {
    updateState((draft) => {
      set(draft.errors, fieldName, error);
    });
  };

  /**
   * 设置表单域执行异步校验的状态
   */
  const setFieldPending = (fieldName: string, isPending: boolean) => {
    updateState((draft) => {
      set(draft.isPending, fieldName, isPending);
    });
  };

  /**
   * 设置异步校验错误
   */
  const setFieldAsyncError = (fieldName: string, asyncError?: string) => {
    updateState((draft) => {
      set(draft.asyncErrors, fieldName, asyncError);
    });
  };

  /**
   * 添加表单域配置
   * @param fieldConfig 表单域配置
   */
  const addField = (fieldConfig: FieldConfig) => {
    const idx = fields.findIndex((item) => item.name === fieldConfig.name);
    if (idx === -1) {
      fields.push(fieldConfig);
    } else {
      fields.splice(idx, 1, fieldConfig);
    }
  };

  /**
   * 删除表单域
   */
  const removeField = (fieldName: string) => {
    const idx = fields.findIndex((item) => item.name === fieldName);

    if (idx !== -1) {
      fields.splice(idx, 1);
    }
  };

  return {
    formState$,
    values$,
    errors$,
    isTouched$,
    asyncErrors$,
    isPending$,

    updateState,
    validate,
    setValues: createUpdateSubStateFn('values'),
    setTouched: createUpdateSubStateFn('isTouched'),
    setErrors: createUpdateSubStateFn('errors'),
    setPending: createUpdateSubStateFn('isPending'),
    setAsyncErrors: createUpdateSubStateFn('asyncErrors'),
    reset,
    setSubmitting,
    submit,

    getFieldState,
    getFieldState$,
    setFieldState,
    setFieldValue,
    validateField,
    blur,
    setFieldTouched,
    setFieldError,
    setFieldPending,
    setFieldAsyncError,

    addField,
    removeField,
  };
}

export default createFormState;
