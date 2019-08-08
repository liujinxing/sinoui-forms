/* eslint-disable import/no-unresolved */
import { useMemo, useCallback, useRef } from 'react';
import { FieldConfig } from '@sinoui/rx-form-state';
import useId from './useId';

/**
 * 处理表单域的hook
 * @param name 表单域名称
 */
function useFormItemState(name?: string) {
  const id = useId();
  const fieldsRef = useRef<Partial<FieldConfig>[]>([]);
  const fields: Partial<FieldConfig>[] = fieldsRef.current;

  /**
   * 新增表单域
   *
   * @param {Partial<FieldConfig>} field 表单域
   * @returns
   */
  const addField = useCallback((field) => {
    fieldsRef.current.push(field);
  }, []);

  /**
   * 删除表单域
   *
   * @param {string} fieldName 表单域名称
   * @returns
   */
  const removeField = useCallback((fieldName) => {
    const idx = fieldsRef.current.indexOf(fieldName);

    if (idx !== -1) {
      fieldsRef.current.splice(idx, 1);
    }
  }, []);

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
