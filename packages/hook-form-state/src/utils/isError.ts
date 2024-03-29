import { FormStateErrors } from '../types';
/**
 * 是否包含错误信息
 *
 * @param errors 表单错误
 */
function isError(errors: FormStateErrors) {
  const keys = Object.keys(errors);
  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    const error = errors[key];
    if (Array.isArray(error)) {
      if (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error.some((item: any) =>
          typeof item === 'string' || item != null ? isError(item) : false,
        )
      ) {
        return true;
      }
    } else if (typeof error === 'object') {
      if (isError(error)) {
        return true;
      }
    } else if (error) {
      return true;
    }
  }
  return false;
}
export default isError;
