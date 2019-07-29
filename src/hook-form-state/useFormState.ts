/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useEffect, useReducer } from 'react';
import { produce } from 'immer';
import debounce from 'lodash/debounce';
import { get, set } from 'lodash';
import calcNewValues from '../utils/calcNewValues';
import reducer, { Reducer, State } from './reducer';
import isError from '../utils/isError';
import { FieldConfig, FormErrors, FormPending, FormTouched } from './types';

interface Options {
  validate?: any;
  onChange?: (newValues: any, oldValues: any) => void;
  onSubmit?: (values: any) => void;
}

/**
 * 设置所有表单域的touched状态为true
 * @param fields 表单域
 */
function touchedAllFields(fields: FieldConfig[]) {
  const touched: {
    [x: string]: boolean;
  } = {};

  fields.forEach((field) => {
    touched[field.name] = true;
  });

  return touched;
}

/**
 *  处理表单状态管理的hooks
 * @param defaultValues 表单默认值
 * @param options 配置项
 */
function useFormState<T extends {}>(defaultValues: T, options?: Options) {
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const [state, dispatch] = useReducer<Reducer<T>>(reducer, {
    values: defaultValues,
    isSubmit: false,
    errors: {},
    asyncErrors: {},
    isTouched: {},
    isPending: {},
  });

  const fieldsRef = useRef<FieldConfig[]>([]);
  const valuesRef = useRef(defaultValues);

  const setFieldValueInner = useCallback((fieldName: string, value: any) => {
    const newValues = produce(valuesRef.current, (draft) => {
      set(draft, fieldName, value);
      calcNewValues(draft, fieldsRef.current, fieldName);
    });

    valuesRef.current = newValues;
    dispatch({
      type: 'SET_FORM_VALUES',
      payload: newValues,
    });
  }, []);

  /**
   * 表单同步校验
   *
   * @param {ValuesType} values 表单值
   * @param {FieldConfig[]} fields 表单域
   * @param {string} fieldName 发生值变更的表单域名称
   * @returns
   */
  const syncValidateFn = useCallback((values, fields: FieldConfig[]) => {
    const newErrors: FormErrors =
      (optionsRef.current &&
        optionsRef.current.validate &&
        optionsRef.current.validate(values)) ||
      {};

    fields.forEach((field) => {
      const fieldError = field.validate(get(values, field.name), values);
      if (fieldError) {
        set(newErrors, field.name, fieldError);
      }
    });

    dispatch({
      type: 'SET_SYNC_ERRORS',
      payload: { errors: newErrors },
    });

    return newErrors;
  }, []);

  /**
   * 处理表单域的异步校验
   *
   * @param {ValuesType} values 表单值
   * @param {FieldConfig[]} fields 表单域
   * @param {string} fieldName 发生值变更的表单域名称
   * @returns
   */
  const asyncValidateFn = useCallback(
    debounce(async (values, fields: FieldConfig[], fieldName: string) => {
      console.log('开始执行异步校验');
      const field = fields.find((item: any) => item.name === fieldName);

      try {
        const asyncFieldValidateResult =
          field &&
          field.asyncValidate &&
          field.asyncValidate(get(values, fieldName), values);

        if (asyncFieldValidateResult) {
          dispatch({
            type: 'ASYNC_VALIDATE_START',
            payload: { fieldName },
          });

          const error = await asyncFieldValidateResult;

          dispatch({
            type: 'ASYNC_VALIDATE_SUCCESS',
            payload: { fieldName, error },
          });
        }
      } catch (error) {
        dispatch({
          type: 'ASYNC_VALIDATE_FAILURE',
          payload: { fieldName },
        });
      }
    }, 200),
    [],
  );

  /**
   * 表单校验
   *
   * @param {ValuesType} values 表单值
   * @param {FieldConfig[]} fields 表单域
   * @param {string} fieldName 发生值变更的表单域名称
   * @returns
   */
  const validateFn = useCallback(
    (fields, fieldName) => {
      const values = valuesRef.current;
      const newErrors = syncValidateFn(values, fields);

      if (!get(newErrors, fieldName)) {
        asyncValidateFn(values, fields, fieldName);
      } else {
        dispatch({
          type: 'REMOVE_ASYNC_ERROR',
          payload: {
            fieldName,
          },
        });
      }
    },
    [syncValidateFn, asyncValidateFn],
  );

  /**
   * 表单域值变更的处理
   *
   * @param {string} name 发生变更的表单域名称
   * @param {any} value 变更之后的值
   * @returns
   */
  const setValue = useCallback(
    (name: string, value: any) => {
      setFieldValueInner(name, value);
      validateFn(fieldsRef.current, name);
    },
    [setFieldValueInner, validateFn],
  );

  /**
   * 新增表单域
   *
   * @param {FieldConfig} field 表单域
   * @returns
   */
  const addField = useCallback((field) => {
    fieldsRef.current.push(field);
  }, []);

  /**
   * 删除表单域
   *
   * @param {string} fieldName 表单域名称
   * @returns
   */
  const removeField = useCallback((fieldName) => {
    const idx = fieldsRef.current.findIndex(
      (field) => field.name === fieldName,
    );
    if (idx !== -1) {
      fieldsRef.current.splice(idx, 1);
      dispatch({
        type: 'REMOVE_FIELD',
        payload: {
          fieldName,
        },
      });
    }
  }, []);

  /**
   * 失去焦点时的处理
   *
   * @param {string} fieldName 表单域名称
   * @returns
   */
  const onBlur = useCallback(
    (fieldName: string) => {
      dispatch({
        type: 'SET_FIELD_TOUCHED',
        payload: {
          fieldName,
        },
      });

      validateFn(fieldsRef.current, fieldName);
    },
    [validateFn],
  );

  /**
   * 表单提交
   *
   * @param {string} fieldName 表单域名称
   * @returns
   */
  const onSubmit = useCallback(async () => {
    dispatch({
      type: 'SUBMIT_START',
      payload: {
        isTouched: touchedAllFields(fieldsRef.current),
      },
    });

    const newErrors = syncValidateFn(valuesRef.current, fieldsRef.current);
    const isErrorExist = isError(newErrors);
    try {
      if (!isErrorExist && optionsRef.current && optionsRef.current.onSubmit) {
        await optionsRef.current.onSubmit(valuesRef.current);

        dispatch({
          type: 'SUBMIT_SUCCESS',
        });
      }
    } catch (error) {
      dispatch({
        type: 'SUBMIT_FAILURE',
      });
    }
  }, [syncValidateFn]);

  /**
   * 设置新的表单值对象
   */
  const setValues = useCallback((newValues: T) => {
    // TODO: 值关联计算？
    dispatch({
      type: 'SET_FORM_VALUES',
      payload: newValues,
    });
    valuesRef.current = newValues;
  }, []);

  const setErrors = useCallback((newErrors: FormErrors) => {
    dispatch({
      type: 'SET_SYNC_ERRORS',
      payload: { errors: newErrors },
    });
  }, []);

  const setPending = useCallback((newPending: FormPending) => {
    dispatch({
      type: 'SET_FORM_PENDING',
      payload: { pending: newPending },
    });
  }, []);

  const setAsyncErrors = useCallback((newAsyncErrors: FormErrors) => {
    dispatch({
      type: 'SET_FORM_ASYNC_ERRORS',
      payload: {
        asyncErrors: newAsyncErrors,
      },
    });
  }, []);

  const setTouched = useCallback((newTouched: FormTouched) => {
    dispatch({
      type: 'SET_FORM_TOUCHED',
      payload: {
        touched: newTouched,
      },
    });
  }, []);

  return {
    ...(state as State<T>),
    setValue,
    setValues,
    setPending,
    addField,
    removeField,
    onBlur,
    onSubmit,
    setErrors,
    setAsyncErrors,
    setTouched,
  };
}

export default useFormState;
