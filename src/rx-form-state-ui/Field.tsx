/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from 'react';
import FormItemContext from '../FormItemContext';
import RxField, { RxFieldProps } from '../rx-form-state/Field';

/**
 * 表单域组件
 */
function Field(props: RxFieldProps) {
  const { name } = props;
  const { id, addField, removeField } = useContext(FormItemContext);

  useEffect(() => {
    if (addField) {
      addField(name);

      return () => {
        removeField(name);
      };
    }
    return undefined;
  }, [name, addField, removeField]);

  return (
    <div className="sinoui-form-field">
      <RxField {...(props as any)} id={`${id}`} />
    </div>
  );
}

export default Field;
