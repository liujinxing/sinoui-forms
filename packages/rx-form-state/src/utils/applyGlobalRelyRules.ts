/* eslint-disable @typescript-eslint/no-unused-vars */
import { produce } from 'immer';
import { RelyRule } from '../types';

/**
 * 格式化JSON路径
 *
 * @param pathes json路径
 */
export const stringifyJSONPath = (pathes: (string | number)[] | string) => {
  if (typeof pathes === 'string') {
    return pathes;
  }

  return pathes.reduce(
    (acc, item) =>
      typeof item === 'number'
        ? `${acc}[${item}]`
        : `${acc}${acc === '' ? '' : '.'}${item}`,
    '',
  ) as string;
};

/**
 * 获取相关的值关联规则
 *
 * @param {RelyRule<T>[]} rules 值关联规则
 * @param {string[]} valueChangedFields 发生值变化的表单域
 * @returns
 */
function findRelativeRuleFns<T>(
  rules: RelyRule<T>[],
  valueChangedFields: string[],
) {
  return rules
    .filter((rule) =>
      rule.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) =>
          valueChangedFields.indexOf(item) !== -1 ||
          valueChangedFields.some((field) => field.startsWith(item)),
      ),
    )
    .map((rule) => rule[rule.length - 1] as (draft: T) => void);
}

/**
 * 应用全局值关联规则
 *
 * @param {RelyRule<T>[]} rules 表单值关联规则
 * @param {string} fieldName 发生值变化的表单域
 * @param {T} values 表单数据
 *
 * @returns {T} 返回应用了值关联规则的新的表单数据
 */
function applyGlobalRelyRules<T>(
  rules: RelyRule<T>[],
  fieldName: string,
  values: T,
) {
  const allChangedFields: string[] = [];
  let newValues = values;

  function inner(changedFields: string[]): void {
    const newChangedFields: string[] = [];
    newValues = produce(
      newValues,
      (draft: T) => {
        const ruleFns = findRelativeRuleFns(rules, changedFields);
        if (rules.length === 0) {
          return;
        }

        allChangedFields.push(...changedFields);

        ruleFns.forEach((ruleFn) => ruleFn(draft));
      },
      (patches) => {
        newChangedFields.push(
          ...patches.map((patch) => stringifyJSONPath(patch.path)),
        );
      },
    );

    if (
      newChangedFields.length > 0 &&
      newChangedFields.every((item) => allChangedFields.indexOf(item) !== -1)
    ) {
      // eslint-disable-next-line no-console
      console.warn('全局表单值关联进入死循环');
    } else if (newChangedFields.length > 0) {
      inner(newChangedFields);
    }
  }

  inner([fieldName]);

  return newValues;
}

export default applyGlobalRelyRules;
