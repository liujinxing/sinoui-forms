/* eslint-disable import/no-unresolved */
import React, { useContext, useMemo } from 'react';
import { useFieldError, useFieldTouched } from '@sinoui/rx-form-state';
import styled from 'styled-components';
import FormItemContext from './FormItemContext';

const FormItemErrorWrapper = styled.div`
  color: ${(props) => props.theme.palette.danger[500]};
  font-size: 12px;
`;

/**
 * 渲染表单域错误信息
 */
function FormItemError() {
  const { name, fields } = useContext(FormItemContext);
  const fieldName = useMemo(
    () => name || (fields.length > 0 ? fields[0].name : undefined),
    [name, fields],
  );
  const error = useFieldError(fieldName);
  const isTouched = useFieldTouched(fieldName);

  return error && isTouched ? (
    <FormItemErrorWrapper
      data-testid="fieldError"
      className="sinoui-form-item-error"
    >
      {error}
    </FormItemErrorWrapper>
  ) : null;
}

export default React.memo(FormItemError);
