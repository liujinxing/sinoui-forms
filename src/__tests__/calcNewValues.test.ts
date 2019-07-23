/* eslint-disable @typescript-eslint/no-explicit-any */
import calcNewValues from '../utils/calcNewValues';

const relyFn1 = (values: any) => {
  if (!values.B) {
    return values.C;
  }

  if (!values.C) {
    return values.B;
  }

  return values.B;
};

const relyFn2 = (values: any) => {
  if (!values.A) {
    return values.E;
  }

  if (!values.E) {
    return values.A;
  }

  return values.A + values.E;
};

const relyFn3 = (values: any) => {
  if (!values.B) {
    return values.C + values.D;
  }

  if (!values.C) {
    return values.B + values.D;
  }

  if (!values.D) {
    return values.B + values.C;
  }

  return values.B + values.C + values.D;
};

const relyFn4 = (values: any) => {
  if (values.B && values.C) {
    return values.B.concat(values.C);
  }
  if (values.B) {
    return values.B;
  }

  if (values.C) {
    return values.C;
  }

  return undefined;
};

it('A=B+C', () => {
  const fields = [
    { name: 'A', relyFieldsName: ['C', 'B'], relyFn: relyFn1 },
    { name: 'B' },
    { name: 'C' },
  ];

  const values = { B: '123' };

  calcNewValues(values, fields as any, 'B');

  expect(values).toEqual({ A: '123', B: '123' });
});

it('不指定relyFn,值不会发生改变', () => {
  const fields = [
    { name: 'A', relyFieldsName: ['C', 'B'] },
    { name: 'B' },
    { name: 'C' },
  ];

  const values = { B: '123' };

  calcNewValues(values, fields as any, 'B');

  expect(values).toEqual({ B: '123' });
});

it('D = A+ E', () => {
  const fields = [
    { name: 'A', relyFieldsName: ['C', 'B'], relyFn: relyFn1 },
    { name: 'B' },
    { name: 'C' },
    { name: 'D', relyFieldsName: ['A', 'E'], relyFn: relyFn2 },
    { name: 'E' },
  ];

  const values = { B: '123' };

  calcNewValues(values, fields as any, 'B');

  expect(values).toEqual({ A: '123', B: '123', D: '123' });
});

it('表单域值为数组时值的重新计算', () => {
  const fields = [
    { name: 'A', relyFieldsName: ['C', 'B'], relyFn: relyFn4 },
    { name: 'B' },
    { name: 'C' },
    { name: 'D', relyFieldsName: ['A'], relyFn: (values: any) => values.A },
  ];

  const values = { A: ['1'], B: ['1', '2'] };

  calcNewValues(values, fields as any, 'B');

  expect(values).toEqual({ A: ['1', '2'], B: ['1', '2'], D: ['1', '2'] });
});

it('死循环', () => {
  const fields = [
    { name: 'A', relyFieldsName: ['C', 'B', 'D'], relyFn: relyFn3 },
    { name: 'B' },
    { name: 'C' },
    { name: 'D', relyFieldsName: ['A', 'E'], relyFn: relyFn2 },
    { name: 'E' },
  ];

  const values = { B: '123' };

  calcNewValues(values, fields as any, 'B');

  expect(values).toEqual({ A: '123123undefined', B: '123', D: '123undefined' });
});
