import isError from '../utils/isError';

it('有校验错误时，返回true', () => {
  const result = isError({
    userName: '必填',
  });

  expect(result).toBeTruthy();
});

it('无校验错误时，返回false', () => {
  const result = isError({});

  expect(result).toBeFalsy();
});

it('错误类型为FormErrors[]时，返回true', () => {
  const result = isError({
    telephones: [
      { type: '必填', telephone: '不能超过11位' },
      { type: '必填', telephone: '不能少于4位' },
    ],
  });

  expect(result).toBeTruthy();
});

it('表单域错误类型为FormErrors时,返回true', () => {
  const result = isError({ adress: { city: '必填' } });

  expect(result).toBeTruthy();
});

it('错误类型为[]时，返回false', () => {
  const result = isError({ fav: [null, null] });

  expect(result).toBeFalsy();
});
