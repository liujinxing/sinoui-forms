/* eslint-disable no-restricted-syntax */
/**
 * 判断对象是否包含值为true的属性
 *
 * @param errors 表单错误
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function containsTruthProperty(object: { [x: string]: any }) {
  const keys = Object.keys(object);

  for (const key of keys) {
    const prop = object[key];
    if (Array.isArray(prop)) {
      if (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        prop.some((item: any) =>
          item && typeof item === 'object' ? containsTruthProperty(item) : item,
        )
      ) {
        return true;
      }
    } else if (typeof prop === 'object') {
      if (containsTruthProperty(prop)) {
        return true;
      }
    } else if (prop) {
      return true;
    }
  }
  return false;
}

export default containsTruthProperty;
