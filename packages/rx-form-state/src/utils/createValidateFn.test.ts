import createValidateFn from './createValidateFn';

it('必填校验', () => {
  expect(createValidateFn({ required: true })('', { userName: '' })).toBe(
    '必填',
  );
});

it('最大值，最小值校验', () => {
  const validate = createValidateFn({ min: 0, max: 10 });
  expect(validate(-1, { age: -1 })).toBe('不能小于0');
  expect(validate(11, { age: 11 })).toBe('不能超过10');
});

it('最大长度，最小长度校验', () => {
  const validate = createValidateFn({ minlength: 2, maxlength: 5 });

  expect(validate('1', { userName: '1' })).toBe('长度不能小于2');
  expect(validate('123456', { userName: '123456' })).toBe('长度不能大于5');
});

it('regexp', () => {
  const validate = createValidateFn({ pattern: '\\d+' });
  expect(validate('二十二', { num: '二十二' })).toBe('违反校验规则：\\d+');
});

it('trimRequired', () => {
  expect(
    createValidateFn({ trimRequired: true })('    ', { userName: '   ' }),
  ).toBe('必填');
});

it('validate', () => {
  expect(
    createValidateFn({ validate: () => '自定义校验' })('', { userName: '' }),
  ).toBe('自定义校验');
});
