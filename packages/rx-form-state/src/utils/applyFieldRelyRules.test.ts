import applyFieldRelyRules, {
  FieldConfig,
  isSame,
} from './applyFieldRelyRules';

interface Person {
  contacts: {
    userName?: string;
    userNameCopy?: string;
    lastName?: string;
    firstName?: string;
  }[];
}

it('嵌套表单的表单域值关联', () => {
  const fields: FieldConfig[] = [
    {
      name: 'contacts[0].userName',
      relyFields: ['contacts[0].firstName', 'contacts[0].lastName'],
      relyFn: (values: Person) =>
        `${values.contacts[0].firstName}${values.contacts[0].lastName}`,
    },
    {
      name: 'contacts[0].userNameCopy',
      relyFields: ['contacts[0].userName'],
      relyFn: (values: Person) => values.contacts[0].userName,
    },
  ];

  const values: Person = {
    contacts: [
      {
        firstName: '张',
        lastName: '三',
      },
    ],
  };

  applyFieldRelyRules(values, fields, 'contacts[0].lastName');

  expect(values.contacts[0].userName).toBe('张三');
  expect(values.contacts[0].userNameCopy).toBe('张三');
});

it('跳过死循环', () => {
  const fields: FieldConfig[] = [
    {
      name: 'A',
      relyFields: ['B'],
      relyFn: (values) => values.B * 2,
    },
    {
      name: 'B',
      relyFields: ['A'],
      relyFn: (values) => values.A * 3,
    },
  ];
  const values = { A: 1, B: 2 };

  applyFieldRelyRules(values, fields, 'A');

  // 方法已结束，说明跳过了关联依赖死循环。

  expect(values).toEqual({
    A: 6,
    B: 18,
  });
});

it('未定义relyFn', () => {
  const fields: FieldConfig[] = [
    {
      name: 'A',
      relyFields: ['B'],
    },
  ];

  const values = { A: 1, B: 2 };

  applyFieldRelyRules(values, fields, 'B');

  expect(values).toEqual({
    A: 1,
    B: 2,
  });
});

it('判断两个数组是否相等', () => {
  expect(isSame([0, 1], [0, 1])).toBe(true);
  const arr1: number[] = [1];
  expect(isSame(arr1, arr1)).toBe(true);
  expect(isSame([0], [1, 2])).toBe(false);
});
