/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect } from 'react';
import useField from './useField';
import isEvent from '../utils/isEvent';
import useValueRef from '../utils/useValueRef';
import { FieldValidateProps, FieldModel } from './types';
import createValidateFn from '../utils/createValidateFn';
import useFormStateContext from './useFormStateContext';

interface Props<T = any> extends FieldValidateProps {
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
  relyFieldsName?: string[];

  /**
   * 值关联计算方法
   */
  relyFn?: (values: any) => any;

  /**
   * 指定渲染函数
   */
  render?: (props: FieldModel<T>) => React.ReactNode;
}

/**
 * 默认的值提取器
 *
 * @param event 值或者变更事件
 */
function defaultValueExtract<T>(
  event: React.ChangeEvent<HTMLInputElement> | T,
) {
  return isEvent(event) ? event.target.value : event;
}

/**
 * 设置表单域配置hook
 *
 * @param props 表单域组件属性
 */
function useSetFieldConfig(props: Props) {
  const { addField, removeField } = useFormStateContext();
  const { name } = props;
  const propsRef = useValueRef(props);
  useEffect(() => {
    const { asyncValidate, relyFieldsName, relyFn } = propsRef.current;
    const fieldConfig = {
      name,
      validate: createValidateFn(propsRef.current),
      asyncValidate,
      relyFieldsName,
      relyFn,
    };
    addField(fieldConfig);
    return () => removeField(name);
  }, [addField, name, propsRef, removeField]);
}

/**
 * 表单域组件
 */
function Field<T = string>(props: Props<T>) {
  const {
    as: AsComp,
    render,
    name,
    defaultValue,
    valueExtract = defaultValueExtract,
  } = props;
  const field = useField<any>(name);
  const { setFieldValue, value = defaultValue, blur, isTouched, error } = field;
  const valueExtractRef = useValueRef(valueExtract);

  useSetFieldConfig(props);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | T) => {
      const newValue = valueExtractRef.current(event);

      setFieldValue(newValue);
    },
    [setFieldValue, valueExtractRef],
  );

  if (render) {
    return render(field);
  }

  if (AsComp) {
    return (
      <AsComp
        data-testid="field-comp"
        name={name}
        value={value === undefined ? defaultValue : value}
        onBlur={blur}
        onChange={handleChange}
        data-error={isTouched && !!error}
      />
    );
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn('未指定as或者render属性。');
  }

  return null;
}

export default Field;
