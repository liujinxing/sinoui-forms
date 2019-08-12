import applyGlobalRelyRules, {
  stringifyJSONPath,
} from './applyGlobalRelyRules';

it('格式化JSON路径', () => {
  expect(stringifyJSONPath('a.b[0]')).toBe('a.b[0]');
  expect(stringifyJSONPath(['a', 'b', 0])).toBe('a.b[0]');
});

interface Model {
  A: number;
  B: number;
  C?: number;
  D?: number;
}

it('全局关联计算', () => {
  const rules = [
    [
      'A',
      'B',
      (draft: Model) => {
        draft.C = draft.A + draft.B;
      },
    ],
    [
      'C',
      (draft: Model) => {
        draft.D = draft.C;
      },
    ],
  ];

  const result = applyGlobalRelyRules(rules, 'A', { A: 1, B: 2 });

  expect(result.C).toBe(3);
  expect(result.D).toBe(3);

  const result2 = applyGlobalRelyRules(rules, 'D', result);
  expect(result2).toBe(result);
});

it('跳过关联死循环', () => {
  const rules = [
    [
      'B',
      (draft: Model) => {
        draft.A = 2 * draft.B;
      },
    ],
    [
      'A',
      (draft: Model) => {
        draft.B = 3 * draft.A;
      },
    ],
  ];

  const result = applyGlobalRelyRules(rules, 'A', { A: 1, B: 2 });

  // applyGlobalRelyRules()函数调用已结束，跳出死循环

  expect(result).toEqual({
    A: 6,
    B: 3,
  });
});

it('找不到值关联规则', () => {
  const values = { A: 1, B: 2 };
  const result = applyGlobalRelyRules([], 'A', values);

  expect(result).toBe(values);
});
