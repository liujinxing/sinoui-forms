import createValidateFn from '../utils/createValidateFn';

it('校验必填', () => {
  const validateFn = createValidateFn({ required: true });

  const error = validateFn('', {});

  expect(error).toBe('必填');
});

it('去空格必填校验', () => {
  const validateFn = createValidateFn({ trimRequired: true });

  const error = validateFn('  ', {});

  expect(error).toBe('必填');
});

it('最大值校验', () => {
  const validateFn = createValidateFn({ max: 10 });

  const error = validateFn(11, {});

  expect(error).toBe('不能超过10');
});

it('最小值校验', () => {
  const validateFn = createValidateFn({ min: 20 });

  const error = validateFn(11, {});

  expect(error).toBe('不能小于20');
});

it('最大长度校验', () => {
  const validateFn = createValidateFn({ maxlength: 5 });

  const error = validateFn('这是一段文本', {});

  expect(error).toBe('长度不能大于5');
});

it('最小长度校验', () => {
  const validateFn = createValidateFn({ minlength: 5 });

  const error = validateFn('123', {});

  expect(error).toBe('长度不能小于5');
});

it('正则校验', () => {
  const validateFn = createValidateFn({ pattern: '[-0-9]+' });

  const error = validateFn('这是123', {});

  expect(error).toBe('违反校验规则：[-0-9]+');
});

it('自定义校验规则', () => {
  const validateFn = createValidateFn({
    validate: (values) => {
      if (!values.userName) {
        return '必填';
      }
      return undefined;
    },
  });

  const error = validateFn('这是123', {});

  expect(error).toBe('必填');
});

it('校验通过', () => {
  const validateFn = createValidateFn({ required: true });
  const error = validateFn('123', {});

  expect(error).toBeUndefined();
});
