import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormStateContext from '../FormStateContext';
import Field from '../ui/Field';
import FormItemContext from '../FormItemContext';

const formState = {
  values: { userName: '张三' },
  errors: {},
  asyncErrors: {},
  isPending: {},
  isTouched: { userName: true },
  setValue: jest.fn(),
  addField: jest.fn(),
  removeField: jest.fn(),
  setValues: jest.fn(),
  setTouched: jest.fn(),
  setErrors: jest.fn(),
  setAsyncErrors: jest.fn(),
  setPending: jest.fn(),
  onBlur: jest.fn(),
};

const formItemState = {
  name: 'userName',
  fields: ['userName', 'password'],
  id: 1,
  addField: jest.fn(),
  removeField: jest.fn(),
};

afterEach(cleanup);

it('不指定as属性和render属性时,Field内部为null', () => {
  const { queryByTestId } = render(
    <FormStateContext.Provider value={formState}>
      <FormItemContext.Provider value={formItemState}>
        <Field name="userName" />
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  expect(queryByTestId('field')).toBeNull();
});

it('指定as属性，渲染一个输入框', () => {
  const { queryByTestId } = render(
    <FormStateContext.Provider value={formState}>
      <FormItemContext.Provider value={formItemState}>
        <Field as="input" name="userName" />
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  expect(queryByTestId('field')).toBeVisible();
  expect(queryByTestId('field')).toHaveAttribute('value', '张三');
});

it('使用render属性渲染一个输入框', async () => {
  const { getByPlaceholderText } = render(
    <FormStateContext.Provider value={formState}>
      <FormItemContext.Provider value={formItemState}>
        <Field
          name="userName"
          render={({ setFieldValue }) => (
            <input
              placeholder="请输入用户名"
              onChange={(event) =>
                setFieldValue('userName', event.target.value)
              }
            />
          )}
        />
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  expect(getByPlaceholderText('请输入用户名')).toBeValid();
});

it('监听值变更', () => {
  const onChange = jest.fn();
  const { getByTestId } = render(
    <FormStateContext.Provider value={formState}>
      <FormItemContext.Provider value={formItemState}>
        <Field as="input" name="userName" onChange={onChange} />
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  fireEvent.change(getByTestId('field'), { target: { value: '李四' } });

  expect(formState.setValue).toHaveBeenCalledTimes(1);
});

it('失去焦点', () => {
  const { getByTestId } = render(
    <FormStateContext.Provider value={formState}>
      <FormItemContext.Provider value={formItemState}>
        <Field as="input" name="userName" />
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  fireEvent.focus(getByTestId('field'));
  fireEvent.blur(getByTestId('field'));

  expect(formState.onBlur).toHaveBeenCalledTimes(1);
});

it('指定valueExtra时，监听值变更', () => {
  const handleChange = jest.fn();
  const onChange = jest.fn();
  const { getByTestId } = render(
    <FormStateContext.Provider value={formState}>
      <FormItemContext.Provider value={formItemState}>
        <Field
          as="input"
          name="userName"
          valueExtract={handleChange}
          onChange={onChange}
        />
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  fireEvent.change(getByTestId('field'), { target: { value: '李四' } });

  expect(onChange).toBeCalledTimes(1);
  expect(handleChange).toHaveBeenCalledTimes(1);
});

it('value不存在时，显示默认值', () => {
  const { getByTestId } = render(
    <FormStateContext.Provider value={formState}>
      <FormItemContext.Provider value={formItemState}>
        <Field as="input" name="firstName" defaultValue="默认值" />
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  expect(getByTestId('field')).toHaveAttribute('value', '默认值');
});
