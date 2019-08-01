/* eslint-disable import/no-unresolved */
import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { useFieldError, useFieldTouched } from '@sinoui/rx-form-state';
import FormItemContext from './FormItemContext';

export interface Props {
  id: number;
  /**
   * 表单域名称
   */
  fieldName?: string;
  /**
   * 标签内容
   */
  children: React.ReactNode;
  /**
   * 自定义标签样式
   */
  style?: React.CSSProperties;
  /**
   * 自定义标签样式类名
   */
  className?: string;
}

function InnerLabel(props: Props) {
  const { id, fieldName, children, style, className } = props;
  const fieldError = useFieldError(fieldName);
  const fieldTouched = useFieldTouched(fieldName);

  return (
    // eslint-disable-next-line jsx-a11y/label-has-for
    <label
      htmlFor={`${id}`}
      style={{
        ...style,
        color: fieldError && fieldTouched ? 'red' : 'inherit',
      }}
      className={classNames('sinoui-form-label', className)}
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
