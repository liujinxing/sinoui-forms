/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react-hooks';
import useFormState from '../hook-form-state/useFormState';

const defaultValue = {
  userName: '张三',
};

it('指定表单默认值', () => {
  const { result } = renderHook(() => useFormState(defaultValue));

  expect(result.current.values).toEqual(defaultValue);
});

it('表单值变更(setValue)', () => {
  const validateFn = jest.fn();
  const { result } = renderHook(() =>
    useFormState({}, { validate: validateFn }),
  );

  result.current.addField({
    name: 'userName',
    validate: (value: any) => {
      if (!value) {
        return '必填';
      }
      return undefined;
    },
  });
  result.current.addField({
    name: 'telephone',
    validate: (value: any) => {
      if (value && value.length > 11) {
        return '长度不能超过11位';
      }
      return undefined;
    },
    asyncValidate: jest.fn(),
  });

  result.current.setValue('userName', '李四');
  result.current.setValue('telephone', '1367474724628442');
  result.current.removeField('userId');

  expect(result.current.values).toEqual({
    userName: '李四',
    telephone: '1367474724628442',
  });
  expect(validateFn).toHaveBeenCalled();
  expect(result.current.errors).toEqual({ telephone: '长度不能超过11位' });

  result.current.setValue('telephone', '121394');

  expect(result.current.values).toEqual({
    userName: '李四',
    telephone: '121394',
  });
  expect(result.current.errors).toEqual({});
});

it('删除已有表单域', () => {
  const validateFn = jest.fn();
  const { result } = renderHook(() =>
    useFormState({}, { validate: validateFn }),
  );

  result.current.addField({
    name: 'userName',
    validate: (value: any) => {
      if (!value) {
        return '必填';
      }
      return undefined;
    },
  });

  result.current.setValue('userName', '');
  expect(result.current.values).toEqual({ userName: '' });
  expect(result.current.errors).toEqual({ userName: '必填' });

  result.current.removeField('userName');
  expect(result.current.values).toEqual({ userName: '' });
  expect(result.current.errors).toEqual({ userName: undefined });
});

it('失去焦点时，需要做表单校验', () => {
  const validateFn = jest.fn();
  const { result } = renderHook(() =>
    useFormState({}, { validate: validateFn }),
  );
  result.current.addField({
    name: 'userName',
    validate: (value: any) => {
      if (!value) {
        return '必填';
      }
      return undefined;
    },
  });

  result.current.onBlur('userName');

  expect(validateFn).toHaveBeenCalled();
  expect(result.current.errors).toEqual({ userName: '必填' });
});

it('设置新的表单值数据对象', () => {
  const validateFn = jest.fn();
  const { result } = renderHook(() =>
    useFormState({}, { validate: validateFn }),
  );

  result.current.addField({
    name: 'userName',
  });
  result.current.addField({
    name: 'userId',
  });

  result.current.setValues({ userId: '002', userName: '张三' });

  expect(result.current.values).toEqual({ userId: '002', userName: '张三' });
});

it('设置错误状态', () => {
  const validateFn = jest.fn();
  const { result } = renderHook(() =>
    useFormState({}, { validate: validateFn }),
  );

  result.current.addField({
    name: 'userName',
  });
  result.current.addField({
    name: 'userId',
  });

  result.current.setErrors({ userName: '必填' });
  result.current.setAsyncErrors({ userId: '此账号不在属于xx部' });

  expect(result.current.errors).toEqual({ userName: '必填' });
  expect(result.current.asyncErrors).toEqual({ userId: '此账号不在属于xx部' });
});

it('设置pending状态', () => {
  const validateFn = jest.fn();
  const { result } = renderHook(() =>
    useFormState({}, { validate: validateFn }),
  );

  result.current.addField({
    name: 'userName',
  });
  result.current.addField({
    name: 'userId',
  });

  expect(result.current.isPending).toEqual({});
  result.current.setPending({ userId: true, userName: undefined });

  expect(result.current.isPending).toEqual({ userId: true });
});

it('设置touched状态', () => {
  const validateFn = jest.fn();
  const { result } = renderHook(() =>
    useFormState({}, { validate: validateFn }),
  );

  result.current.addField({
    name: 'userName',
  });
  result.current.addField({
    name: 'userId',
  });

  expect(result.current.isTouched).toEqual({});
  result.current.setTouched({ userId: true, userName: true });

  expect(result.current.isTouched).toEqual({ userId: true, userName: true });
});

it('表单提交成功', async () => {
  const validateFn = jest.fn();
  const onSubmit = jest.fn();
  const { result } = renderHook(() =>
    useFormState({}, { validate: validateFn, onSubmit }),
  );

  result.current.addField({
    name: 'userName',
    validate: jest.fn(),
    asyncValidate: jest.fn(),
  });
  result.current.addField({
    name: 'userId',
    validate: jest.fn(),
  });

  result.current.setValues({ userId: '001', userName: '张三' });

  expect(result.current.isSubmit).toBeFalsy();

  await result.current.onSubmit();

  expect(result.current.isSubmit).toBeFalsy();
});

it('表单提交失败', async () => {
  const validateFn = jest.fn();
  const onSubmit = jest.fn().mockRejectedValue(new Error('获取出错'));
  const { result } = renderHook(() =>
    useFormState({}, { validate: validateFn, onSubmit }),
  );

  result.current.addField({
    name: 'userName',
    validate: jest.fn(),
    asyncValidate: jest.fn(),
  });
  result.current.addField({
    name: 'userId',
    validate: jest.fn(),
  });

  result.current.setValues({ userId: '001', userName: '张三' });

  expect(result.current.isSubmit).toBeFalsy();

  await result.current.onSubmit();

  expect(onSubmit).toHaveBeenCalled();

  expect(result.current.isSubmit).toBeFalsy();
});

it('表单异步校验', async () => {
  const validateFn = jest.fn();

  const { result, waitForNextUpdate } = renderHook(() =>
    useFormState({}, { validate: validateFn }),
  );

  result.current.addField({
    name: 'userName',
    validate: jest.fn(),
    asyncValidate: jest.fn().mockResolvedValue('必填'),
  });
  result.current.addField({
    name: 'userId',
    validate: jest.fn(),
    asyncValidate: jest.fn().mockResolvedValue(undefined),
  });

  await result.current.setValue('userName', '');

  jest.runAllTimers();

  await waitForNextUpdate();
  await waitForNextUpdate();

  expect(result.current.asyncErrors).toEqual({ userName: '必填' });
});
