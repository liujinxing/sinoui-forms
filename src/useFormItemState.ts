import { useState, useMemo, useCallback } from 'react';

import useId from './useId';

/**
 * 处理表单域的hook
 * @param name 表单域名称
 */
function useFormItemState(name?: string) {
  const id = useId();
  const [fields, setFields] = useState<string[]>([]);

  const addField = useCallback((fieldName: string) => {
    setFields((prev) => {
      if (prev.indexOf(fieldName) !== -1) {
        return prev;
      }
      return [...prev, fieldName];
    });
  }, []);

  const removeField = useCallback((fieldName: string) => {
    setFields((prev) => {
      if (prev.indexOf(fieldName) !== -1) {
        return prev.filter((field) => field !== fieldName);
      }
      return prev;
    });
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
