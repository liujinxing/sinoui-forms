import isError from './isError';

it('判断校验结果', () => {
  const errors = {
    itemA: ['必填', undefined, ''],
  };

  expect(isError(errors)).toBeTruthy();

  expect(
    isError({
      itemA: ['', '', ''],
    }),
  ).toBeFalsy();

  expect(
    isError({
      a: {
        b: '必填',
      },
    }),
  ).toBeTruthy();

  expect(
    isError({
      a: [
        {
          b: '必填',
        },
      ],
    }),
  ).toBeTruthy();
});
