import React from 'react';
import { FieldModel, FieldValidateProps } from '@sinoui/rx-form-state';

export interface Props<T = any> extends FieldValidateProps {
  /**
   * 表单域名称。可以指定路径。
   *
   * 例如：
   *
   * * `userName`
   * * `address.city`
   * * `friends[0].name`
   */
  name: string;
  /**
   * 指定表单域组件
   */
  as?: React.ReactType;
  /**
   * 默认值。
   */
  defaultValue?: T;
  /**
   * 指定值提取器
   */
  valueExtract?: (event: any) => T;

  /**
   * 表单域异步校验方法
   *
   * @param {*} value 表单域值
   * @param {*} values 表单值
   *
   * @returns {(string | undefined | null | Promise<string | undefined>} 返回校验结果
   */
  asyncValidate?: (value: any, values: any) => Promise<string | undefined>;

  /**
   * 关联字段名
   */
  relyFields?: string[];

  /**
   * 值关联计算方法
   */
  relyFn?: (values: any) => any;

  /**
   * 指定渲染函数
   */
  render?: (props: FieldModel<T>) => React.ReactNode;
}

function FieldApi(props: Props) {
  return <div {...props} />;
}

export default FieldApi;
