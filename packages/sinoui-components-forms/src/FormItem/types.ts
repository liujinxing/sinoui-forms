/**
 * 表单域配置
 */
export interface FieldConfig {
  name?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

/**
 * 表单项状态模型
 */
export interface FormItemStateModel {
  fields: FieldConfig[];
  id: number;
  name?: string;
  inline?: boolean;
  vertical?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

/**
 * 表单项上下文状态模型
 */
export interface FormItemContextStateModel {
  id: number;
  name?: string;
  readOnly?: boolean;
  disabled?: boolean;
  inline?: boolean;
  vertical?: boolean;
  required?: boolean;
}

export interface FormItemContextModel {
  addField: (fieldConfig: FieldConfig) => void;
  removeField: (name: string) => void;
  setFormItemProps: (
    formItemProps: Omit<FormItemStateModel, 'id' | 'fields'>,
  ) => void;
  useFormItem: () => FormItemContextStateModel;
  useFormItemProps: () => Omit<FormItemStateModel, 'fields'>;
}
