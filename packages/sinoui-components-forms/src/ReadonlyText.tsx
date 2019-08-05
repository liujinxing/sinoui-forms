import React from 'react';
import { InputWrapper } from 'sinoui-components/TextInput';
import styled from 'sinoui-components/styles';
import FormText, { Props as FormTextPorps } from './FormText';

export interface ReadonlyTextProps extends FormTextPorps {
  /**
   * 表单域名称
   */
  name?: string;
  /**
   * 子元素
   */
  children?: React.ReactNode;
}

const StyledInputWrapper = styled(InputWrapper)`
  padding-top: 4px;
  min-height: 36px;
  &:hover:before {
    background-color: ${(props) => props.theme.palette.input.bottomLine};
    height: 1px;
  }
`;

export default function ReadonlyText(props: ReadonlyTextProps) {
  return (
    <StyledInputWrapper>
      <FormText {...props} />
    </StyledInputWrapper>
  );
}
