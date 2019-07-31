import React, { useMemo } from 'react';
import classNames from 'classnames';
// eslint-disable-next-line import/no-unresolved
import { useFieldError } from '@sinoui/rx-form-state';
import FormItemContext from './FormItemContext';
import FieldError from './FieldError';
import useFormItemState from './useFormItemState';

interface Props {
  name?: string;
  children: React.ReactNode;
}

/**
 * 表单项
 */
function FormItem(props: Props) {
  const { name, children } = props;
  const context = useFormItemState(name);
  const { fields } = context;
  const fieldName = useMemo(
    () => name || (fields.length > 0 ? fields[0] : undefined),
    [name, fields],
  );

  const fieldError = useFieldError(fieldName);

  return (
    <FormItemContext.Provider value={context}>
      <div
        data-testid="formItem"
        className={classNames({ invalid: fieldError })}
      >
        {children}
        <FieldError />
      </div>
    </FormItemContext.Provider>
  );
}

export default FormItem;
