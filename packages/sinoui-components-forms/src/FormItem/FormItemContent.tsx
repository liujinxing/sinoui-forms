import React from 'react';
import styled from 'styled-components';
import FormControlContent from 'sinoui-components/Form/FormControl/FormControlContent';
import FormItemContentContext from './FormItemContentContext';

interface Props {
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 子元素
   */
  children?: React.ReactNode;
}

const StyledFormControlContent = styled(FormControlContent)`
  padding-bottom: 0px;
  align-self: flex-end;
`;

function FormItemContent(props: Props) {
  const context = { inFormItemContent: true };
  const { style, children } = props;
  return (
    <FormItemContentContext.Provider value={context}>
      <StyledFormControlContent
        className="sinoui-form-item__content"
        style={style}
      >
        {children}
      </StyledFormControlContent>
    </FormItemContentContext.Provider>
  );
}

export default FormItemContent;
