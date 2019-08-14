import React, { useState } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import useFormState from './useFormState';
import FormStateContext from './FormStateContext';
import Field from './Field';

afterEach(cleanup);

it('创建表单状态', () => {
  const { result } = renderHook(() => useFormState());

  expect(result.current.values$.value).toEqual({});
});

it('指定表单初始值', () => {
  const { result } = renderHook(() => useFormState({ userName: '张三' }));

  expect(result.current.values$.value).toEqual({ userName: '张三' });
});

it('指定表单校验逻辑和表单提交处理', async () => {
  const onSubmit = jest.fn();
  onSubmit.mockResolvedValue('ok');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validate = ({ userName }: any) =>
    userName ? {} : { userName: '姓名不能为空' };
  const { result } = renderHook(() => useFormState({}, { onSubmit, validate }));

  result.current.validate();

  expect(result.current.errors$.value).toEqual({
    userName: '姓名不能为空',
  });

  result.current.setFieldValue('userName', '张三');

  expect(result.current.errors$.value).toEqual({});

  await result.current.submit();

  expect(onSubmit).toHaveBeenCalledWith(
    result.current.values$.value,
    result.current,
  );
});

it('新的初始值', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const [initialValues, setInitialValues] = useState({});
    const formState = useFormState(initialValues);

    return (
      <FormStateContext.Provider value={formState}>
        {children}
        <button
          type="button"
          onClick={() => setInitialValues({ userName: '张三' })}
          data-testid="setInitialValuesButton"
        >
          更新初始值
        </button>
      </FormStateContext.Provider>
    );
  };

  const { getByTestId } = render(
    <Wrapper>
      <Field as="input" name="userName" data-testid="userNameField"></Field>
    </Wrapper>,
  );

  fireEvent.click(getByTestId('setInitialValuesButton'));

  expect(getByTestId('userNameField')).toHaveAttribute('value', '张三');
});

it('重绘时不会引起无限重绘', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState({
      favs: ['1', '2', '3'],
      userName: '测试',
    });
    const [, setCount] = useState(0);

    return (
      <FormStateContext.Provider value={formState}>
        {children}
        <button
          type="button"
          onClick={() => setCount(0)}
          data-testid="setInitialValuesButton"
        >
          更新初始值
        </button>
      </FormStateContext.Provider>
    );
  };

  const { getByTestId } = render(
    <Wrapper>
      <Field as="input" name="userName" data-testid="userNameField"></Field>
    </Wrapper>,
  );

  fireEvent.click(getByTestId('setInitialValuesButton'));

  expect(getByTestId('userNameField')).toHaveAttribute('value', '测试');
});

it('useFormState指定options时，不会应用新的初始值', () => {
  // issue #2
  const { result, rerender } = renderHook((initialValues) =>
    useFormState(initialValues, { onSubmit: jest.fn() }),
  );

  act(() => {
    rerender({ userName: '张三' });
  });

  expect(result.current.values).toEqual({
    userName: '张三',
  });
  
it('指定options情况下重绘时可能导致restState被重置', () => {
  const { result, rerender } = renderHook(() =>
    useFormState(undefined, { onSubmit: jest.fn() }),
  );

  act(() => {
    result.current.setFieldValue('userName', '测试');
  });

  expect(result.current.values.userName).toBe('测试');

  act(() => {
    rerender();
  });

  expect(result.current.values.userName).toBe('测试');
});
