/* eslint-disable import/no-unresolved */
import React, { useContext } from 'react';
import FormLabel from 'sinoui-components/Form/FormControl/FormLabel';
import {
  useFormStateContext,
  FieldValidateProps,
  FormUI,
} from '@sinoui/rx-form-state';
import classNames from 'classnames';
import FormItemContentContext from './FormItem/FormItemContentContext';
import FormItemContext, { FormItemState } from './FormItem/FormItemContext';
import useFieldValid from './useFieldValid';

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
 * 判断是否包含有必填校验的field
 */
function containsRequired(fields: FieldValidateProps[]) {
  return fields.length > 0 && !!fields[0].required;
}

/**
 * 从表单上下文中获取标签属性
 */
function getLabelPropsFromSinouiFormContext(sinouiForm: FormUI) {
  return {
    colon: sinouiForm.colon,
    ...sinouiForm.labelProps,
  };
}

/**
 * 从表单项上下文中获取标签属性
 */
function getLabelPropsFromFormItemContext({
  id,
  fields = [],
  inline,
  vertical,
  readOnly,
  disabled,
}: FormItemState) {
  return {
    vertical,
    readOnly,
    disabled,
    inline,
    htmlFor: `${id}`,
    required: containsRequired(fields),
  };
}

/**
 * 表单项标签
 * @param props
 */
const Label: React.SFC<LabelProps> = (props) => {
  const { name, className } = props;
  const formState = useFormStateContext();
  const isValid = useFieldValid(name);
  const { inFormItemContent } = useContext(FormItemContentContext);

  const formItemContext = useContext(FormItemContext);

  const labelProps = {
    ...getLabelPropsFromSinouiFormContext(formState.sinouiForm || ({} as any)),
    ...getLabelPropsFromFormItemContext(formItemContext),
    ...props,
  };

  labelProps.align = labelProps.vertical ? 'left' : labelProps.align;
  labelProps.width = labelProps.inline ? 'auto' : labelProps.width;
  labelProps.error = !isValid;

  return !inFormItemContent ? (
    <PureFormLabel
      {...labelProps}
      className={classNames('sinoui-form-label', className)}
    />
  ) : null;
};

Label.displayName = 'Label';

export default Label;
