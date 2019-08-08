import containsTruthProperty from './containsTruthProperty';

it('判断对象所有属性是否为true', () => {
  expect(
    containsTruthProperty({
      a: {
        b: true,
      },
    }),
  ).toBe(true);

  expect(
    containsTruthProperty({
      c: [false, false, false, undefined, false],
    }),
  ).toBe(false);

  expect(
    containsTruthProperty({
      d: [false, false, false, undefined, false, true],
    }),
  ).toBe(true);

  expect(
    containsTruthProperty({
      c: [
        {
          d: false,
          e: {
            f: true,
          },
        },
      ],
    }),
  ).toBe(true);
});
