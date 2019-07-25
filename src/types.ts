/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FieldValidateProps {
  /**
   * 指定表单域校验函数
   */
  validate?: (values: any) => string | undefined | null;

  /**
   * 是否必填
   */
  required?: boolean;

  /**
   * 不包含空白符的必填校验
   */
  trimRequired?: boolean;

  /**
   * 指定最小值
   */
  min?: number;

  /**
   * 指定最大值
   */
  max?: number;

  /**
   * 字符串最大长度
   */
  maxlength?: number;

  /**
   * 字符串最小长度
   *
   * @type {number}
   * @memberof Props
   */
  minlength?: number;

  /**
   * 正则校验
   *
   * @type {string}
   * @memberof Props
   */
  pattern?: string;

  /**
   * 正则校验失败的错误信息
   */
  patternErrorMessage?: string;

  /**
   * 标题提示语
   */
  title?: string;
}

export interface FieldConfig {
  name: string;
  validate(value: any, values: any): string | undefined | null;
  valueExtract?: (event: any) => any;
  asyncValidate?: (
    value: any,
    values: any,
  ) => Promise<string | undefined> | undefined;
  relyFieldsName?: string[];
  relyFn?: (values: any) => any;
}

export interface FormErrors {
  [fieldName: string]: string | undefined | FormErrors | FormErrors[];
}

export interface FormTouched {
  [fieldName: string]: boolean | undefined | FormTouched | FormTouched[];
}

export interface FormPending {
  [fieldName: string]: boolean | undefined | FormPending | FormTouched[];
}

export interface FormState<T> {
  values: T;
  errors: FormErrors;
  asyncErrors: FormErrors;
  isPending: FormPending;
  isTouched: FormTouched;

  setValue: (name: string, value: any) => void;
  addField: (field: FieldConfig) => void;
  removeField: (fieldName: string) => void;
  onBlur?: (fileName: string) => void;

  setValues: (values: T) => void;
  setTouched: (touched: FormTouched) => void;
  setErrors: (errors: FormErrors) => void;
  setAsyncErrors: (asyncErrors: FormErrors) => void;
  setPending: (pending: FormPending) => void;
}
