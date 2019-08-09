/* eslint-disable import/no-unresolved */
import { useFieldError, useFieldTouched } from '@sinoui/rx-form-state';

/**
 * 获取表单域校验状态
 * @param fieldName 表单域名称
 */
export default function useFieldValid(fieldName?: string) {
  const fieldError = useFieldError(fieldName);
  const fieldTouched = useFieldTouched(fieldName);

  return !(fieldTouched && !!fieldError);
}
