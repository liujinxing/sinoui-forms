import React, { useContext, useMemo } from 'react';
import FormItemContext from '../FormItemContext';
import useFieldError from '../hook-form-state/useFieldError';
import useFieldTouched from '../hook-form-state/useFieldTouched';

interface Props {
  id: number;
  fieldName?: string;
  /**
   * 标签内容
   */
  children: React.ReactNode;
}

function InnerLabel(props: Props) {
  const { id, fieldName, children } = props;
  const fieldError = useFieldError(fieldName);
  const fieldTouched = useFieldTouched(fieldName);

  return (
    // eslint-disable-next-line jsx-a11y/label-has-for
    <label
      htmlFor={`${id}`}
      style={{ color: fieldError && fieldTouched ? 'red' : 'inherit' }}
      className="sinoui-form-label"
    >
      {children}
    </label>
  );
}

const MemoInnerLabel = React.memo(InnerLabel);

/**
 * 表单域标签
 * @param props
 */
function Label(props: Omit<Props, 'id' | 'name'>) {
  const { id, name, fields } = useContext(FormItemContext);
  const fieldName = useMemo(
    () => name || (fields.length > 0 ? fields[0] : undefined),
    [name, fields],
  );

  return <MemoInnerLabel {...props} id={id} fieldName={fieldName} />;
}

export default Label;
