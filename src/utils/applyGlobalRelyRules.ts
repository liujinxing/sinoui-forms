/* eslint-disable @typescript-eslint/no-unused-vars */
import { produce } from 'immer';
import { RelyRule } from '../rx-form-state/types';

const pathToString = (pathes: (string | number)[] | string) => {
  if (typeof pathes === 'string') {
    return pathes;
  }

  return pathes.reduce(
    (acc, item) =>
      typeof item === 'number' ? `${acc}[${item}]` : `${acc}.${item}`,
    '',
  ) as string;
};

/**
 * 获取相关的值关联规则
 */
function findRelativeRuleFns<T>(
  rules: RelyRule<T>[],
  valueChangedFields: string[],
) {
  return rules
    .filter((rule) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rule.some(
        (item: any) =>
          valueChangedFields.indexOf(item) !== -1 ||
          valueChangedFields.some((field) => field.startsWith(item)),
      ),
    )
    .map((rule) => rule[rule.length - 1] as (draft: T) => void);
}

/**
 * 应用全局值关联规则
 */
function applyGlobalRelyRules<T>(
  rules: RelyRule<T>[],
  fieldName: string,
  values: T,
) {
  const allChangedFields: string[] = [];
  let newChangedFields: string[] = [];

  return produce(
    values,
    (draft: T) => {
      function inner(changedFields: string[]): void {
        const ruleFns = findRelativeRuleFns(rules, changedFields);
        if (rules.length === 0) {
          return;
        }

        allChangedFields.push(...changedFields);
        newChangedFields = [];

        ruleFns.forEach((ruleFn) => ruleFn(draft));

        if (
          newChangedFields.length > 0 &&
          newChangedFields.every(
            (item) => allChangedFields.indexOf(item) !== -1,
          )
        ) {
          // eslint-disable-next-line no-console
          console.warn('全局表单值关联进入死循环');
        } else if (newChangedFields.length > 0) {
          inner(newChangedFields);
        }
      }

      inner([fieldName]);
    },
    (patches) => {
      newChangedFields.push(
        ...patches.map((patch) => pathToString(patch.path)),
      );
    },
  );
}

export default applyGlobalRelyRules;
