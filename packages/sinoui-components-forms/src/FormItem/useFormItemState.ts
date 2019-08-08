/* eslint-disable import/no-unresolved */
import { useMemo, useCallback, useState } from 'react';
import { FieldConfig, FieldValidateProps } from '@sinoui/rx-form-state';
import { produce } from 'immer';
import useId from './useId';

/**
 * 处理表单域的hook
 * @param name 表单域名称
 */
function useFormItemState(name?: string) {
  const id = useId();
  const [fields, setFields] = useState<
    (Partial<FieldConfig> & FieldValidateProps)[]
  >([]);

  /**
   * 新增表单域
   *
   * @param {Partial<FieldConfig> & FieldValidateProps} field 表单域
   * @returns
   */
  const addField = useCallback(
    (field: Partial<FieldConfig> & FieldValidateProps) => {
      const idx = fields.findIndex((item) => item.name === field.name);
      if (idx === -1) {
        setFields(
          produce((draft) => {
            draft.push(field);
          }),
        );
      } else {
        setFields(
          produce((draft) => {
            draft.splice(idx, 1, field);
          }),
        );
      }
    },
    [fields],
  );

  /**
   * 删除表单域
   *
   * @param {string} fieldName 表单域名称
   * @returns
   */
  const removeField = useCallback(
    (fieldName) => {
      const idx = fields.findIndex((field) => field.name === fieldName);

      if (idx !== -1) {
        setFields(
          produce((draft) => {
            draft.splice(idx, 1);
          }),
        );
      }
    },
    [fields],
  );

  const context = useMemo(
    () => ({
      id,
      name,
      fields,
      addField,
      removeField,
    }),
    [id, name, fields, addField, removeField],
  );

  return context;
}

export default useFormItemState;
