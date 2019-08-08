/* eslint-disable import/no-unresolved */
import React, { useContext } from 'react';
import FormLabel from 'sinoui-components/Form/FormControl/FormLabel';
import {
  useFormStateContext,
  useFieldTouched,
  useFieldError,
  FieldConfig,
  FieldValidateProps,
} from '@sinoui/rx-form-state';
import classNames from 'classnames';
import FormItemContentContext from './FormItem/FormItemContentContext';
import FormItemContext from './FormItem/FormItemContext';

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
 * 获取必填状态
 */
function getRequired(fields: (Partial<FieldConfig> & FieldValidateProps)[]) {
  const idx = fields.findIndex((field) => field.required);
  if (idx !== -1) {
    return true;
  }
  return false;
}

/**
 * 表单项标签
 * @param props
 */
const Label: React.SFC<LabelProps> = (props) => {
  const { name, className } = props;
  const formState = useFormStateContext();
  const fieldError = useFieldError(name);
  const fieldTouched = useFieldTouched(name);
  const { inFormItemContent } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useContext(FormItemContentContext) || ({} as any);
  const { id, fields = [], inline, vertical, readOnly, disabled } = useContext(
    FormItemContext,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let otherProps: any = {};

  if (formState.sinouiForm) {
    otherProps = {
      colon: formState.sinouiForm.colon,
      vertical,
      inline,
      ...formState.sinouiForm.labelProps,
    };
  }

  otherProps.error = !!(fieldTouched && fieldError);

  const labelProps = {
    ...otherProps,
    ...props,
    required: getRequired(fields),
    readOnly,
    disabled,
  };

  labelProps.htmlFor = `${id}` || labelProps.htmlFor || labelProps.name;
  labelProps.align = labelProps.vertical ? 'left' : labelProps.align;
  labelProps.width = labelProps.inline ? 'auto' : labelProps.width;

  return !inFormItemContent ? (
    <PureFormLabel
      {...labelProps}
      className={classNames('sinoui-form-label', className)}
    />
  ) : null;
};

Label.displayName = 'Label';

export default Label;
