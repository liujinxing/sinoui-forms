/* eslint-disable import/no-unresolved */
import React, { useContext } from 'react';
import FormLabel from 'sinoui-components/Form/FormControl/FormLabel';
import classNames from 'classnames';
import FormItemContentContext from './FormItem/FormItemContentContext';
import FormItemContext from './FormItem/FormItemContext';
import useFieldValid from './useFieldValid';
import SinouiFormStateContext, {
  SinouiFormState,
} from './SinouiFormStateContext';

const PureFormLabel = React.memo(FormLabel);

export interface LabelProps {
  /**
   * 标签名称
   */
  name?: string;
  htmlFor?: string;
  /**
   * 对齐方式
   */
  align?: 'left' | 'right' | 'center';
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 标签内容
   */
  children?: React.ReactNode;
  /**
   * 自定义宽度
   */
  width?: string;
  /**
   * 自定义样式类
   */
  className?: string;
}

/**
 * 从表单上下文中获取标签属性
 */
function getLabelPropsFromSinouiFormContext(sinouiForm: SinouiFormState) {
  if (sinouiForm) {
    return {
      colon: sinouiForm.colon,
      ...sinouiForm.labelProps,
    };
  }
  return null;
}

/**
 * 克隆对象的非undefined的属性
 *
 * @param object 对象
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cloneObjectValue(object: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newObj: any = {};
  const keys = Object.keys(object);

  keys.forEach((key) => {
    if (object[key] !== undefined) {
      newObj[key] = object[key];
    }
  });

  return newObj;
}

/**
 * 表单项标签
 * @param props
 */
const Label: React.SFC<LabelProps> = (props) => {
  const { name: nameFromFormItemContext, ...formItemProps } = useContext(
    FormItemContext,
  ).useFormItem();
  const { name = nameFromFormItemContext, className } = props;

  const sinouiFormState = useContext(SinouiFormStateContext);
  const isValid = useFieldValid(name);
  const { inFormItemContent } = useContext(FormItemContentContext);

  const labelProps = {
    ...getLabelPropsFromSinouiFormContext(sinouiFormState),
    ...formItemProps,
    ...props,
  };

  labelProps.align = labelProps.vertical ? 'left' : labelProps.align;
  labelProps.width = labelProps.inline ? 'auto' : labelProps.width;
  labelProps.error = !isValid;

  return !inFormItemContent ? (
    <PureFormLabel
      {...cloneObjectValue(labelProps)}
      className={classNames('sinoui-form-label', className)}
    />
  ) : null;
};

Label.displayName = 'Label';

export default Label;
