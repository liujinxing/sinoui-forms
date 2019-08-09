/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject } from 'rxjs';

export type RelyRule<T> =
  | [string, (draft: T) => void]
  | [string, string, (draft: T) => void]
  | [string, string, string, (draft: T) => void]
  | [string, string, string, string, (draft: T) => void]
  | [string, string, string, string, string, (draft: T) => void]
  | [string, string, string, string, string, string, (draft: T) => void]
  | [string, string, string, string, string, string, string, (draft: T) => void]
  | [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      (draft: T) => void,
    ]
  | [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      (draft: T) => void,
    ]
  | [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      (draft: T) => void,
    ]
  | (string | ((draft: T) => void))[];

/**
 * 创建表单状态的配置
 */
export interface FormStateOptions<T> {
  /**
   * 指定表单验证逻辑
   */
  validate?: (values: T) => FormStateErrors | undefined;
  /**
   * 指定表单提交逻辑。
   */
  onSubmit?: (values: T, formState: FormState) => Promise<any> | void;
  /**
   * 指定全局值关联规则
   */
  relys?: RelyRule<T>[];
}

/**
 * 表单域内置校验属性
 */
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
   */
  minlength?: number;

  /**
   * 正则校验
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
  /**
   * 表单域名称
   */
  name: string;
  /**
   * 表单域校验方法
   *
   * @param {*} value 表单域值
   * @param {*} values 表单值
   * @returns {(string | undefined | null)}
   */
  validate(value: any, values: any): string | undefined | null;
  /**
   * 表单域异步校验方法
   *
   * @param {*} value 表单域值
   * @param {*} values 表单值
   *
   * @returns {(string | undefined | null | Promise<string | undefined>} 返回校验结果
   */
  asyncValidate?: (
    value: any,
    values: any,
  ) => Promise<string | undefined> | undefined;
  /**
   * 关联字段名
   */
  relyFields?: string[];
  /**
   * 值关联计算方法
   */
  relyFn?: (values: any) => any;
}

export interface FormStateErrors {
  [fieldName: string]:
    | string
    | undefined
    | FormStateErrors
    | FormStateErrors[]
    | (string | undefined)[];
}

export interface FormStateTouched {
  [fieldName: string]:
    | boolean
    | undefined
    | (boolean | undefined)[]
    | FormStateTouched
    | FormStateTouched[];
}

export interface FormStatePending {
  [fieldName: string]:
    | boolean
    | undefined
    | (boolean | undefined)[]
    | FormStatePending
    | FormStatePending[];
}

export interface FormUI {
  /**
   * 表单域标签内容后是否有冒号
   */
  colon: boolean;
  /**
   * label配置
   */
  labelProps?: any;
  /**
   * 表单标签和表单域水平布局
   */
  inline?: boolean;
  /**
   * 表单标签和表单域垂直布局
   */
  vertical?: boolean;
}

/**
 * 表单状态模型
 */
export interface FormStateModel<T extends {} = any> {
  /**
   * 表单值
   */
  values: T;
  /**
   * 表单域校验错误
   */
  errors: FormStateErrors;
  /**
   * 表单域异步校验错误
   */
  asyncErrors: FormStateErrors;
  /**
   * 表单域被操作的状态，一般在表单域失去焦点时设置。
   */
  isTouched: FormStateTouched;
  /**
   * 表单域正在执行异步校验的状态
   */
  isPending: FormStatePending;
  /**
   * 表单提交中状态
   */
  isSubmitting: boolean;
}

/**
 * 表单域状态模型
 */
export interface FieldStateModel<T = any> {
  /**
   * 表单域名称
   */
  name: string;
  /**
   * 表单域值
   */
  value: T;
  /**
   * 表单错误
   */
  error?: string | null;
  /**
   * 表单异步错误
   */
  asyncError?: string | null;
  /**
   * 被操作状态
   */
  isTouched: boolean;
  /**
   * 异步校验过程状态
   */
  isPending: boolean;
}

/**
 * 表单状态
 *
 * @export
 * @template T
 */
export interface FormState<T = any> {
  /**
   * 表单状态
   */
  formState$: BehaviorSubject<FormStateModel<T>>;

  /**
   * 表单值
   */
  values$: BehaviorSubject<T>;

  /**
   * 表单校验错误状态
   */
  errors$: BehaviorSubject<FormStateErrors>;

  /**
   * 表单域被操作状态
   */
  isTouched$: BehaviorSubject<FormStateTouched>;

  /**
   * 异步校验错误状态
   */
  asyncErrors$: BehaviorSubject<FormStateErrors>;

  /**
   * 执行异步校验的过程状态
   */
  isPending$: BehaviorSubject<FormStatePending>;

  /**
   * 表单值
   */
  values: T;

  /**
   * 表单校验错误
   */
  errors: FormStateErrors;

  /**
   * 表单异步校验错误
   */
  asyncErrors: FormStateErrors;

  /**
   * 表单域被操作状态
   */
  isTouched: FormStateTouched;

  /**
   * 表单域异步校验状态
   */
  isPending: FormStatePending;

  /**
   * 表单提交状态
   */
  isSubmitting: boolean;

  /**
   * 表单是否正在做异步校验
   */
  isFormPending: boolean;

  /**
   * 表单校验是否通过
   */
  isValid: boolean;

  /**
   * 更新表单状态
   *
   * @param {(draft: FormStateModel<T>) => void} producer 更新表单状态的方法
   * @returns {FormStateModel<T>} 返回新的表单状态
   */
  updateState(producer: (draft: FormStateModel<T>) => void): FormStateModel<T>;

  /**
   * 设置表单值
   *
   * @param {T} values 表单值
   */
  setValues(values: T): void;

  /**
   * 设置表单初始值
   *
   * @param initialValues 表单初始值
   */
  setInitialValues(initialValues: T): void;

  /**
   * 校验表单（注意，此方法不会触发表单域异步校验）
   *
   * @returns {boolean}
   */
  validate(): boolean;

  /**
   * 设置表单校验错误
   *
   * @param {FormStateErrors} errors 表单校验错误
   * @memberof FormState
   */
  setErrors(errors: FormStateErrors): void;

  /**
   * 设置所有表单域的点击状态
   *
   * @param {FormStateTouched} isTouched 表单域的点击状态
   */
  setTouched(isTouched: FormStateTouched): void;

  /**
   * 设置异步校验错误
   *
   * @param {FormStateErrors} asyncErrors 异步校验错误
   */
  setAsyncErrors(asyncErrors: FormStateErrors): void;

  /**
   * 设置表单异步校验的过程状态
   *
   * @param {FormStatePending} isPending 异步校验的过程状态
   */
  setPending(isPending: FormStatePending): void;

  /**
   * 表单重置
   *
   * @param {T} [defaultValues] 重置后的表单值。默认为`intialValues`
   */
  reset(defaultValues?: T): void;

  /**
   * 提交表单
   *
   * @param [event] 提交表单事件
   */
  submit(event?: React.FormEvent<HTMLFormElement>): Promise<any>;

  /**
   * 设置提交中状态
   *
   * @param {boolean} submiting 表单是否提交中
   */
  setSubmitting(submiting: boolean): void;

  /**
   * 获取表单域状态
   *
   * @param fieldName 表单域名称
   * @returns 返回表单域状态
   */
  getFieldState<M = any>(fieldName: string): FieldStateModel<M>;

  /**
   * 获取表单域状态的可观察对象
   *
   * @param {string} fieldName 表单域名称
   * @returns 返回表单域状态的可观察对象
   */
  getFieldState$<M = any>(
    fieldName: string,
  ): BehaviorSubject<FieldStateModel<M>>;

  /**
   * 设置表单域状态
   *
   * @param fieldName 表单域名称
   * @param producer 设置表单域状态的函数
   */
  setFieldState<M>(
    fieldName: string,
    producer: (draft: FieldStateModel<M>) => void,
  ): FieldStateModel<M>;

  /**
   * 设置表单域值。这个方法会触发表单的校验逻辑
   *
   * @param {string} fieldName 表单域名称
   * @param {*} value 表单域值
   */
  setFieldValue<M = any>(fieldName: string, value: M): void;

  /**
   * 校验表单域
   *
   * @param {string} fieldName 表单域名称
   * @memberof FormState
   */
  validateField(fieldName: string): void;

  /**
   * 设置表单域的被操作状态
   *
   * @param {string} fieldName 表单域名称
   * @param {boolean} [isTouched=true] 被操作状态
   */
  setFieldTouched(fieldName: string, isTouched?: boolean): void;

  /**
   * 设置表单域错误
   *
   * @param {string} fieldName 表单域名称
   * @param {string} [error] 表单域错误
   */
  setFieldError(fieldName: string, error?: string): void;

  /**
   * 设置表单域的异步校验过程状态
   *
   * @param fieldName 表单域名称
   * @param isPending 表单域的异步校验状态
   */
  setFieldPending(fieldName: string, isPending: boolean): void;

  /**
   * 设置表单域的异步错误
   *
   * @param fieldName 表单域名称
   * @param asyncError 表单域的异步错误
   */
  setFieldAsyncError(fieldName: string, asyncError?: string): void;

  /**
   * 处理表单域失去焦点事件
   *
   * @param fieldName 表单域名称
   */
  blur(fieldName: string): void;

  /**
   * 添加表单域配置
   *
   * @param {FieldConfig} field
   */
  addField(field: FieldConfig): void;

  /**
   * 删除表单域配置
   *
   * @param {string} fieldName
   */
  removeField(fieldName: string): void;
  /**
   * 表单样式的配置
   */
  sinouiForm?: FormUI;
}

/**
 * 表单域模型
 */
export interface FieldModel<T> extends FieldStateModel<T> {
  formState: FormState;
  addField: FormState['addField'];
  removeField: FormState['removeField'];
  setFieldValue: (value: T) => void;
  blur: () => void;
  validateField: () => void;
  setFieldState: (
    producer: (draft: FieldStateModel<T>) => void,
  ) => FieldStateModel<T>;
  setFieldTouched: (isTouched?: boolean) => void;
  setError: (error?: string) => void;
  setAsyncError: (asyncError?: string) => void;
  setFieldPending: (isPending: boolean) => void;
}

/**
 * 数组类型表单域辅助方法
 */
export interface FieldArrayHelpers<T> {
  items: T[];
  /**
   * 新增数据
   *
   * @param item 需要新增的数据项
   */
  push(item: T): void;
  /**
   * 插入数据
   *
   * @param index 数据插入的位置
   * @param item 需要插入的数据项
   */
  insert(index: number, item: T): void;
  /**
   * 删除数据
   *
   * @param idx 需要删除数据项的索引位置
   */
  remove(idx: number): void;
  /**
   * 移动数据项
   *
   * @param fromIdx 数据项移动前的位置
   * @param toIdx 数据项移动后的位置
   */
  move(fromIdx: number, toIdx: number): void;

  /**
   * 交换数据项
   *
   * @param indexA 需要交换的数据项1
   * @param indexB 需要交换的数据项2
   */
  swap(indexA: number, indexB: number): void;

  /**
   * 替换数据项
   *
   * @param index 需要替换数据项的位置
   * @param item 新的数据
   */
  replace(index: number, item: T): void;

  /**
   * 移除数组的第一个数据项
   */
  pop(): void;

  /**
   * 在数组的头部添加数据项
   *
   * @param item 新增的数据项
   */
  unshift(item: T): void;

  /**
   * 获取表单域名称
   */
  getFieldName(index: number, subFieldName?: string): string;
}
