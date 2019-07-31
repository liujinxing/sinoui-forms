/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, set } from 'lodash';

export interface FieldConfig {
  name: string;
  relyFields?: string[];
  relyFn?: (values: any) => any;
}

export interface ValuesType {
  [name: string]: any;
}

/**
 * 获取依赖于当前发生值变更的表单域的其它表单域
 * @param fields 所有表单域
 * @param fieldName 发生值变更的表单域名称
 */
export function getFields(fields: FieldConfig[], fieldName: string) {
  const hasRelyFields = fields.filter((field) => field.relyFields);

  return hasRelyFields.filter(
    (field) => field.relyFields && field.relyFields.includes(fieldName),
  );
}

/**
 * 比较表单域的值是否相同
 * @param newValue 表单域当前的值
 * @param oldValue 变更之前的值
 */
function isSame(newValue: any, oldValue: any) {
  if (Array.isArray(newValue) && Array.isArray(oldValue)) {
    return (
      newValue === oldValue ||
      (newValue.length === oldValue.length &&
        newValue.every((v, i) => v === oldValue[i]))
    );
  }
  return newValue === oldValue;
}

/**
 *
 * @param values 表单的值
 * @param fields 所有表单域
 * @param filedName 发生变更的表单域名称
 */
function calcNewValues(
  values: ValuesType,
  fields: FieldConfig[],
  fieldName: string,
) {
  const valueChangedFields: string[] = [];

  const inner = (name: string) => {
    const reliedFields = getFields(fields, name);
    const needCalcFields = [];

    for (let i = 0; i < reliedFields.length; i += 1) {
      const field = reliedFields[i];
      if (!field.relyFn) {
        continue;
      }
      const newFieldValue = field.relyFn(values);
      const oldFieldValue = get(values, field.name);
      set(values, field.name, newFieldValue);
      if (!isSame(newFieldValue, oldFieldValue)) {
        if (valueChangedFields.includes(field.name)) {
          console.error(
            `检测到对${field.name}的值关联表达式可能进入了死循环，请检查值关联设置。`,
          );
          continue;
        }
        valueChangedFields.push(field.name);
        needCalcFields.push(field.name);
      }
    }

    for (let i = 0; i < needCalcFields.length; i += 1) {
      inner(needCalcFields[i]);
    }
  };

  inner(fieldName);
}

export default calcNewValues;
