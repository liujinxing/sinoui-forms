import React, { useContext, useMemo } from 'react';
import useFieldError from '../useFieldError';
import FormItemContext from '../FormItemContext';
import useFieldTouched from '../useFieldTouched';

/**
 * 渲染表单域错误信息
 */
function FieldError() {
  const { name, fields } = useContext(FormItemContext);
  const fieldName = useMemo(
    () => name || (fields.length > 0 ? fields[0] : undefined),
    [name, fields],
  );
  const error = useFieldError(fieldName);
  const isTouched = useFieldTouched(fieldName);

  return error && isTouched ? (
    <div data-testid="fieldError" style={{ color: 'red', fontSize: 12 }}>
      {error}
    </div>
  ) : null;
}

export default React.memo(FieldError);
