/* eslint-disable import/no-unresolved */
import React from 'react';
import FormLabel from 'sinoui-components/Form/FormControl/FormLabel';
import {
  useFormStateContext,
  useFieldTouched,
  useFieldError,
} from '@sinoui/rx-form-state';

const PureFormLabel = React.memo(FormLabel);

export interface Props {
  /**
   * 标签名称
   */
  name?: string;
  htmlFor?: string;
  /**
   * 水平布局
   */
  inline?: boolean;
  /**
   * 垂直布局
   */
  vertical?: boolean;
  /**
   * 对齐方式
   */
  align?: 'left' | 'right' | 'center';
}

/**
 * 表单项标签组件。
 *
 * @private
 */
const FormItemLabel: React.SFC<Props> = (props) => {
  const { name } = props;
  const formState = useFormStateContext();
  const fieldError = useFieldError(name);
  const fieldTouched = useFieldTouched(name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let otherProps: any = {};

  if (formState.sinouiForm) {
    otherProps = {
      colon: formState.sinouiForm.colon,
      ...formState.sinouiForm.labelProps,
    };
  }

  otherProps.error = !!(fieldTouched && fieldError);

  const labelProps = {
    ...otherProps,
    ...props,
  };

  labelProps.htmlFor = labelProps.htmlFor || labelProps.name;
  labelProps.align = labelProps.vertical ? 'left' : labelProps.align;
  labelProps.width = labelProps.inline ? 'auto' : labelProps.width;

  return <PureFormLabel {...labelProps} />;
};

export default FormItemLabel;
