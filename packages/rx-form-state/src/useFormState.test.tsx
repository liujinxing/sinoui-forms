import React, { useState } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent, cleanup } from '@testing-library/react';
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
