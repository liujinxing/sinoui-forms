/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-named-as-default */
import React, { useMemo } from 'react';
import { Field, FieldProps } from '@sinoui/web-forms';
import Select, { SelectProps } from 'sinoui-components/Select';
import styled from 'styled-components';
import { useFieldError, useFieldTouched } from '@sinoui/rx-form-state';

const emptyArray: string[] = [];

export type SelectFieldProps = Omit<SelectProps, 'value'> &
  Omit<FieldProps, 'ref'> & { stringValue?: boolean };

const FieldWrapper = styled(Field)`
  .sinoui-form-item & .sinoui-select-field {
    margin-top: 4px;
    width: 100%;
  }

  .sinoui-form-item & .sinoui-select-field .sinoui-select__content {
    flex: 1;
  }
`;

const valueExtract = (
  _event: React.ChangeEvent<HTMLSelectElement>,
  value: string | string[],
) => {
  return value;
};

/**
 * 选择框表单域
 */
function SelectField(props: SelectFieldProps) {
  const { multiple, stringValue, children, name } = props;
  const validatedChildren = useMemo(() => {
    return React.Children.toArray(children).filter(Boolean);
  }, [children]);
  const fieldError = useFieldError(name);
  const fieldTouched = useFieldTouched(name);

  return (
    <FieldWrapper
      as={Select}
      wrapperClassName="sinoui-select-field"
      defaultValue={multiple && !stringValue ? emptyArray : ''}
      valueExtract={valueExtract}
      error={!!(fieldTouched && fieldError)}
      {...props}
    >
      {validatedChildren}
    </FieldWrapper>
  );
}

export default SelectField;
