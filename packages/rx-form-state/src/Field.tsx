/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect } from 'react';
import useField from './useField';
import isEvent from './utils/isEvent';
import useValueRef from './utils/useValueRef';
import { FieldValidateProps, FieldModel } from './types';
import createValidateFn from './utils/createValidateFn';
import useFormStateContext from './useFormStateContext';

interface FieldConfig<AsCompProps = any, T = any> extends FieldValidateProps {
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
  as?: React.ReactType<AsCompProps>;
  /**
   * 默认值。
   */
  defaultValue?: T;
  /**
   * 指定值提取器
   */
  valueExtract?: (event: any, ...rest: any[]) => T;

  /**
   * 表单域异步校验方法
   *
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

  /**
   * 引用as组件的ref
   */
  innerRef?: React.Ref<any>;
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

type GenericFieldHTMLAttributes =
  | JSX.IntrinsicElements['input']
  | JSX.IntrinsicElements['select']
  | JSX.IntrinsicElements['textarea'];

export type RxFieldProps<
  AsCompProps = GenericFieldHTMLAttributes,
  T = any
> = FieldConfig<AsCompProps, T> & AsCompProps;

/**
 * 设置表单域配置hook
 *
 * @param props 表单域组件属性
 */
function useSetFieldConfig(props: RxFieldProps<any, any>) {
  const { addField, removeField } = useFormStateContext();
  const { name } = props;
  const propsRef = useValueRef(props);
  useEffect(() => {
    const { asyncValidate, relyFields, relyFn } = propsRef.current;
    const fieldConfig = {
      name,
      validate: createValidateFn(propsRef.current),
      asyncValidate,
      relyFields,
      relyFn,
    };
    addField(fieldConfig);
    return () => removeField(name);
  }, [addField, name, propsRef, removeField]);
}

/**
 * 表单域组件
 */
function Field<AsCompProps = GenericFieldHTMLAttributes, T = string>(
  props: RxFieldProps<AsCompProps, T>,
) {
  const {
    as: AsComp,
    render,
    name,
    defaultValue,
    valueExtract = defaultValueExtract,
    asyncValidate,
    relyFields,
    relyFn,
    validate,
    required,
    onChange,
    onBlur,
    innerRef,
    ...rest
  } = props as any;
  const field = useField<any>(name);
  const { setFieldValue, value = defaultValue, blur, isTouched, error } = field;
  const valueExtractRef = useValueRef(valueExtract);
  const onChangeRef = useValueRef<any>(onChange);
  const onBlurRef = useValueRef<any>(onBlur);

  useSetFieldConfig(props);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | T, ...args: any[]) => {
      const newValue = valueExtractRef.current(event, ...args);

      setFieldValue(newValue);

      if (onChangeRef.current) {
        onChangeRef.current(event as any, ...args);
      }
    },
    [onChangeRef, setFieldValue, valueExtractRef],
  );

  const handleBlur = useCallback(
    (event: any) => {
      blur();

      if (onBlurRef.current) {
        onBlurRef.current(event);
      }
    },
    [blur, onBlurRef],
  );

  if (render) {
    return render(field) as JSX.Element;
  }

  if (AsComp) {
    return (
      <AsComp
        data-testid="field-comp"
        {...rest}
        ref={innerRef}
        name={name}
        value={value === undefined ? defaultValue : value}
        onBlur={handleBlur}
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
