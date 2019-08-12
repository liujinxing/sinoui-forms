/* eslint-disable @typescript-eslint/no-explicit-any */
import createFormState from './createFormState';
import { FormStateErrors, FieldStateModel } from './types';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

it('读取表单初始值', () => {
  const formState = createFormState({
    userName: '张三',
  });

  expect(formState.values).toEqual({
    userName: '张三',
  });
});

it('读取默认的表单初始值', () => {
  const formState = createFormState();

  expect(formState.values).toEqual({});
});

it('设置表单值', () => {
  const formState = createFormState();

  formState.setValues({
    userName: '张三',
  });

  expect(formState.values).toEqual({
    userName: '张三',
  });
});

it('设置表单初始值', () => {
  const formState = createFormState({
    userName: '张三',
  });

  formState.setInitialValues({
    userName: '王五',
  });

  expect(formState.values).toEqual({
    userName: '王五',
  });

  formState.setFieldValue('userName', '李四');
  formState.reset();

  expect(formState.values).toEqual({
    userName: '王五',
  });
});

it('表单校验', () => {
  const formState = createFormState(
    {},
    {
      validate: (values: any) => {
        const errors: FormStateErrors = {};

        if (!values.userName) {
          errors.userName = '必填';
        }

        return errors;
      },
    },
  );

  formState.addField({ name: 'userName', validate: () => undefined });

  expect(formState.isValid).toBe(true);
  const result = formState.validate();

  expect(result).toBe(false);
  expect(formState.errors).toEqual({
    userName: '必填',
  });
  expect(formState.isValid).toBe(false);
  expect(formState.isTouched).toEqual({
    userName: true,
  });
});

it('表单域校验', () => {
  const formState = createFormState();

  formState.addField({
    name: 'userName',
    validate: (value: any) => {
      if (!value) {
        return '必填';
      }
      return undefined;
    },
  });

  const result = formState.validate();

  expect(result).toBe(false);
  expect(formState.errors).toEqual({
    userName: '必填',
  });
});

it('删除表单域之后做表单校验', () => {
  const formState = createFormState();

  formState.addField({
    name: 'userName',
    validate: (value: any) => {
      if (!value) {
        return '必填';
      }
      return undefined;
    },
  });

  formState.removeField('userName');

  const result = formState.validate();

  expect(result).toBe(true);
});

it('表单校验与表单域校验', () => {
  const formState = createFormState(
    {},
    {
      validate: (values: any) => {
        const errors: FormStateErrors = {};

        if (values.userName && values.userName.startsWith('张')) {
          errors.userName = '不能以“张”开头';
        }
        return errors;
      },
    },
  );

  formState.addField({
    name: 'userName',
    validate: (value: any) => {
      if (!value) {
        return '必填';
      }
      return undefined;
    },
  });

  formState.validate();

  expect(formState.errors).toEqual({
    userName: '必填',
  });

  formState.setValues({
    userName: '张三',
  });

  formState.validate();

  expect(formState.errors).toEqual({
    userName: '不能以“张”开头',
  });
});

it('更新表单状态', () => {
  const formState = createFormState();

  formState.updateState((draft) => {
    draft.values.userName = '张三';
    draft.errors.userName = '长度不够3位';
  });

  expect(formState.values).toEqual({
    userName: '张三',
  });
  expect(formState.errors).toEqual({
    userName: '长度不够3位',
  });
});

it('重置表单', () => {
  const formState = createFormState();

  formState.updateState((draft) => {
    draft.errors = {
      userName: '必填',
    };
    draft.values = {
      userName: '',
    };
    draft.isTouched = {
      userName: true,
    };
    draft.asyncErrors = {
      userName: '必填',
    };
    draft.isPending = {
      userName: true,
    };
    draft.isSubmitting = true;
  });

  formState.reset();

  expect(formState.values).toEqual({});
  expect(formState.errors).toEqual({});
  expect(formState.isPending).toEqual({});
  expect(formState.isSubmitting).toBe(false);
  expect(formState.isTouched).toEqual({});
  expect(formState.asyncErrors).toEqual({});
});

it('有校验错误时，不允许提交表单', async () => {
  const onSubmit = jest.fn();
  const validate = () => {
    return {
      userName: '必填',
    };
  };

  const formState = createFormState(
    {},
    {
      onSubmit,
      validate,
    },
  );

  formState.addField({ name: 'userName', validate: () => undefined });

  await expect(formState.submit()).rejects.toThrowError('表单校验失败');

  expect(onSubmit).not.toHaveBeenCalled();
  expect(formState.isTouched).toEqual({
    userName: true,
  });
});

it('有异步校验错误时，不允许提交表单', async () => {
  const onSubmit = jest.fn();

  const formState = createFormState(
    {},
    {
      onSubmit,
    },
  );

  formState.addField({ name: 'userName', validate: () => undefined });
  formState.updateState((draft) => {
    draft.asyncErrors = {
      userName: '用户名已存在',
    };
  });

  await expect(formState.submit()).rejects.toThrowError('表单校验失败');

  expect(onSubmit).not.toHaveBeenCalled();
});

it('提交表单', async () => {
  const onSubmit = jest.fn();
  onSubmit.mockResolvedValue('ok');
  const preventDefault = jest.fn();
  const stopPropagation = jest.fn();
  const formState = createFormState({}, { onSubmit });

  const promise = formState.submit({ preventDefault, stopPropagation } as any);

  expect(formState.isSubmitting).toBe(true);

  await promise;

  expect(onSubmit).toHaveBeenCalledWith(formState.values, formState);
  expect(preventDefault).toHaveBeenCalled();
  expect(stopPropagation).toHaveBeenCalled();
  expect(formState.isSubmitting).toBe(false);
});

it('提交表单失败', async () => {
  const onSubmit = jest.fn();
  onSubmit.mockRejectedValue(new Error('失败'));

  const formState = createFormState({}, { onSubmit });

  const promise = formState.submit();

  await expect(promise).rejects.toThrowError('失败');

  expect(formState.isSubmitting).toBe(false);
});

it('提交表单失败，但是设置了校验错误', async () => {
  const onSubmit = jest.fn(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    formState.setAsyncErrors({
      userName: '用户名已存在',
    });

    return Promise.reject(new Error('表单提交错误'));
  });

  const formState = createFormState({}, { onSubmit });

  formState.addField({ name: 'userName', validate: () => undefined });

  const promise = formState.submit();

  await expect(promise).rejects.toThrow();
  expect(formState.isValid).toBe(false);
  expect(formState.isTouched.userName).toBe(true);
});

it('提交表单时，如果表单校验失败，则返回表单校验错误', async () => {
  const formState = createFormState();
  formState.addField({ name: 'userName', validate: () => '必填' });

  const promise = formState.submit();

  expect(promise).rejects.toThrowError('表单校验失败');
});

it('等待异步校验完成后，完成表单提交', async () => {
  const onSubmit = jest.fn();
  const formState = createFormState({}, { onSubmit });
  formState.setFieldPending('userName', true);

  const promise = formState.submit();

  expect(onSubmit).not.toBeCalled();

  formState.setFieldPending('userName', false);

  await promise;

  expect(onSubmit).toBeCalled();
});

it('获取表单域状态', () => {
  const formState = createFormState();

  formState.updateState((draft) => {
    draft.values = {
      userName: '张三',
      age: 10,
    };
    draft.isPending = {
      userName: true,
    };
    draft.errors = {
      userName: '长度不足三位',
    };
  });

  expect(formState.getFieldState('userName')).toEqual({
    name: 'userName',
    value: '张三',
    isPending: true,
    error: '长度不足三位',
    asyncErrors: undefined,
    isTouched: undefined,
  });

  expect(formState.isFormPending).toBe(true);

  expect(formState.getFieldState$('userName').value).toBe(
    formState.getFieldState('userName'),
  );
});

it('监听表单域状态', () => {
  const formState = createFormState();
  let newFieldState: FieldStateModel | undefined;

  formState.getFieldState$('userName').subscribe((_) => {
    newFieldState = _;
  });

  formState.updateState((draft) => {
    draft.values.userName = '李四';
  });

  expect(newFieldState).toBeDefined();

  if (newFieldState) {
    expect(newFieldState.value).toBe('李四');
  }

  formState.updateState((draft) => {
    draft.isTouched.userName = true;
  });

  if (newFieldState) {
    expect(newFieldState.isTouched).toBe(true);
  }
});

it('设置表单域状态', () => {
  const formState = createFormState();

  formState.setFieldState('userName', (draft) => {
    draft.value = '紫诺';
    draft.asyncError = '此用户名已存在';
  });

  expect(formState.getFieldState('userName').value).toBe('紫诺');
  expect(formState.getFieldState('userName').asyncError).toBe('此用户名已存在');
});

it('设置表单值', async () => {
  const validate = () => {
    return {
      userName: '长度不能少于3位',
    };
  };

  const formState = createFormState({}, { validate });

  formState.addField({
    name: 'userNameCopy',
    validate: () => undefined,
    relyFields: ['userName'],
    relyFn: (values: any) => values.userName,
  });

  formState.setFieldValue('userName', '紫诺');

  expect(formState.values).toEqual({
    userName: '紫诺',
    userNameCopy: '紫诺',
  });

  expect(formState.errors.userName).toBe('长度不能少于3位');
});

it('表单域异步校验', async () => {
  const asyncValidate = jest.fn();
  asyncValidate.mockResolvedValue('此用户名已存在');

  const formState = createFormState({});

  formState.addField({
    name: 'userName',
    validate: () => undefined,
    asyncValidate,
  });

  formState.setFieldValue('userName', '紫诺');

  jest.runAllTimers();

  expect(formState.isPending.userName).toBe(true);
  expect(formState.isFormPending).toBe(true);

  jest.useRealTimers();

  await new Promise((resolve) => {
    setTimeout(() => resolve(), 10);
  });

  expect(formState.isPending.userName).toBe(false);
  expect(formState.isFormPending).toBe(false);
  expect(formState.asyncErrors.userName).toBe('此用户名已存在');
});

it('在表单域异步校验过程中，表单域变更了同步错误', async () => {
  const asyncValidate = jest.fn();
  asyncValidate.mockResolvedValue('此用户名已存在');

  const formState = createFormState({});

  formState.addField({
    name: 'userName',
    validate: () => undefined,
    asyncValidate,
  });

  formState.setFieldValue('userName', '紫诺');

  jest.runAllTimers();

  expect(formState.isPending.userName).toBe(true);
  expect(formState.isFormPending).toBe(true);

  formState.setFieldState('userName', (draft) => {
    draft.error = '此用户名不够长';
  });

  jest.useRealTimers();

  await new Promise((resolve) => {
    setTimeout(() => resolve(), 10);
  });

  expect(formState.isPending.userName).toBe(false);
  expect(formState.isFormPending).toBe(false);
  expect(formState.asyncErrors.userName).toBeFalsy();
});

it('表单域异步校验失败', async () => {
  const asyncValidate = jest.fn();
  asyncValidate.mockRejectedValue('');

  const formState = createFormState({});

  formState.addField({
    name: 'userName',
    validate: () => undefined,
    asyncValidate,
  });

  formState.setFieldValue('userName', '紫诺');

  jest.runAllTimers();

  expect(formState.isPending.userName).toBe(true);
  expect(formState.isFormPending).toBe(true);

  jest.useRealTimers();

  await new Promise((resolve) => {
    setTimeout(() => resolve(), 10);
  });

  expect(formState.isPending.userName).toBe(false);
  expect(formState.isFormPending).toBe(false);
});

it('表单域失去焦点', () => {
  const validate = () => ({ userName: '必填' });
  const formState = createFormState({}, { validate });

  formState.blur('userName');

  expect(formState.isTouched.userName).toBe(true);
  expect(formState.errors.userName).toBe('必填');
});

it('全局值关联', () => {
  // A = B + C
  const abcRely = [
    'B',
    'C',
    (draft: any) => {
      if (draft.B && draft.C) {
        draft.A = `${draft.B} ${draft.C}`;
      }
    },
  ];

  // E = D
  const deRely = [
    'D',
    (draft: any) => {
      draft.E = draft.D;
    },
  ];

  const formState = createFormState(
    {},
    {
      relys: [abcRely, deRely],
    },
  );

  formState.setFieldValue('B', 'Jacking');
  formState.setFieldValue('C', 'Liu');

  expect(formState.values.A).toBe('Jacking Liu');

  formState.setFieldValue('D', '123456');

  expect(formState.values.E).toBe('123456');
});

it('全局深度值关联', () => {
  // A = B + C
  const abcRely = [
    'B',
    'C',
    (draft: any) => {
      if (draft.B && draft.C) {
        draft.A = `${draft.B} ${draft.C}`;
      }
    },
  ];

  // B = D + E
  const deRely = [
    'D',
    'E',
    (draft: any) => {
      if (draft.D && draft.E) {
        draft.B = `${draft.D} ${draft.E}`;
      }
    },
  ];

  const formState = createFormState(
    {},
    {
      relys: [abcRely, deRely],
    },
  );

  formState.setFieldValue('D', 'Jacking');
  formState.setFieldValue('E', 'And');
  formState.setFieldValue('C', 'zinuo');

  expect(formState.values.A).toBe('Jacking And zinuo');
});

it('设置表单域的校验状态', () => {
  const formState = createFormState();

  formState.setFieldError('userName', '必填');
  formState.setFieldTouched('userName', true);
  formState.setFieldAsyncError('userName', '不能为空');
  formState.setFieldPending('userName', false);

  expect(formState.getFieldState('userName').isTouched).toBe(true);
  expect(formState.getFieldState('userName').error).toBe('必填');
  expect(formState.getFieldState('userName').asyncError).toBe('不能为空');
  expect(formState.getFieldState('userName').isPending).toBe(false);
});

it('重复添加表单域', () => {
  const validate1 = jest.fn();
  const validate2 = jest.fn();
  const formState = createFormState();

  formState.addField({ name: 'userName', validate: validate1 });
  formState.addField({ name: 'userName', validate: validate2 });

  formState.validate();

  expect(validate1).not.toBeCalled();
  expect(validate2).toBeCalled();
});

it('表单校验返回undefined', () => {
  const validate = jest.fn();
  const formState = createFormState(null, { validate });

  formState.validate();

  expect(formState.errors).toEqual({});
});
