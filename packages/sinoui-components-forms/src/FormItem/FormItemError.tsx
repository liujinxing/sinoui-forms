/* eslint-disable import/no-unresolved */
import React from 'react';
import { FormHelpText } from 'sinoui-components/Form';
import styled from 'sinoui-components/styles';
import { useFieldTouched, useFieldError } from '@sinoui/rx-form-state';

export interface Props {
  /**
   * 表单域名称
   */
  name?: string;
  /**
   * 错误类型
   */
  errorMessageType?: 'none' | 'normal' | 'tooltip';
  /**
   * 左边距
   */
  paddingLeft: string;
}

const CustomFormHelpText = styled(FormHelpText)<Props>`
  padding-left: ${(props) => props.paddingLeft || '120px'};
`;

/**
 * 表单项错误提示。
 */
const FormItemError: React.SFC<Props> = ({
  name,
  errorMessageType,
  paddingLeft,
}) => {
  const fieldError = useFieldError(name);
  const fieldTouched = useFieldTouched(name);

  return errorMessageType !== 'none' && !!(fieldTouched && fieldError) ? (
    <CustomFormHelpText paddingLeft={paddingLeft} error>
      {fieldError}
    </CustomFormHelpText>
  ) : null;
};

export default FormItemError;
