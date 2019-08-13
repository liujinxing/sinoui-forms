import { BehaviorSubject } from 'rxjs';
import { produce } from 'immer';
import { useBehaviorSubject } from '@sinoui/rx-form-state';
import {
  FormItemStateModel,
  FieldConfig,
  FormItemContextStateModel,
} from './types';

/**
 * 创建表单项上下文
 *
 * @param initialState 初始状态
 */
export default function createFormItemContext(
  initialState: FormItemStateModel = { fields: [], id: 0 },
) {
  const state$ = new BehaviorSubject(initialState);

  /**
   * 设置表单项属性
   *
   * @param {FormItemStateModel} formItemProps 表单项属性
   */
  function setFormItemProps(
    formItemProps: Omit<FormItemStateModel, 'fields' | 'id'>,
  ) {
    state$.next({
      ...state$.value,
      ...formItemProps,
    });
  }

  /**
   * 添加表单域配置
   *
   * @param fieldConfig 表单域配置
   */
  const addField = (fieldConfig: FieldConfig) => {
    state$.next(
      produce(state$.value, (draft) => {
        const idx = draft.fields.findIndex(
          (item) => item.name === fieldConfig.name,
        );
        if (idx === -1) {
          draft.fields.push(fieldConfig);
        } else {
          draft.fields.splice(idx, 1, fieldConfig);
        }
      }),
    );
  };

  /**
   * 移除表单域
   *
   * @param name 表单域名称
   */
  const removeField = (name: string) => {
    state$.next(
      produce(state$.value, (draft) => {
        const idx = draft.fields.findIndex((item) => item.name === name);

        if (idx !== -1) {
          draft.fields.splice(idx, 1);
        }
      }),
    );
  };

  /**
   * 获取表单项状态
   */
  const getState = (): FormItemContextStateModel => {
    const { fields, ...rest } = state$.value;
    const field = fields[0];

    if (field) {
      const name = rest.name || field.name;
      const readOnly =
        typeof rest.readOnly === 'boolean' ? rest.readOnly : field.readOnly;
      const disabled =
        typeof rest.disabled === 'boolean' ? rest.disabled : field.disabled;
      return {
        ...rest,
        name,
        readOnly,
        disabled,
        required: field.required,
      };
    }

    return rest;
  };

  /**
   * 获取表单项上下文状态的hook
   */
  const useFormItem = () => {
    return useBehaviorSubject(state$, getState);
  };

  const getFormItemProps = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fields, ...rest } = state$.value;
    return rest;
  };

  const useFormItemProps = () => {
    return useBehaviorSubject(state$, getFormItemProps);
  };

  return {
    setFormItemProps,
    addField,
    removeField,
    useFormItem,
    useFormItemProps,
  };
}
