import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Field from '../Field';
import FormItemContext from '../FormItem/FormItemContext';
import Wrapper from './FormTestWrapper';

const formItemState = {
  name: 'userName',
  fields: [{ name: 'userName' }, { name: 'password' }],
  id: 1,
  addField: jest.fn(),
  removeField: jest.fn(),
};

afterEach(cleanup);

it('不指定as属性和render属性时,Field内部为null', () => {
  const { queryByTestId } = render(
    <Wrapper>
      <FormItemContext.Provider value={formItemState}>
        <Field name="userName" data-testid="field" />
      </FormItemContext.Provider>
    </Wrapper>,
  );

  expect(queryByTestId('field')).toBeNull();
});

it('指定as属性，渲染一个输入框', () => {
  const { queryByTestId } = render(
    <Wrapper defaultValues={{ userName: '张三' }}>
      <FormItemContext.Provider value={formItemState}>
        <Field as="input" name="userName" data-testid="field" />
      </FormItemContext.Provider>
    </Wrapper>,
  );

  expect(queryByTestId('field')).toBeVisible();
  expect(queryByTestId('field')).toHaveAttribute('value', '张三');
});

it('使用render属性渲染一个输入框', async () => {
  const { getByPlaceholderText } = render(
    <Wrapper>
      <FormItemContext.Provider value={formItemState}>
        <Field
          data-testid="field"
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
    </Wrapper>,
  );

  expect(getByPlaceholderText('请输入用户名')).toBeValid();
});

it('监听值变更', () => {
  const onChange = jest.fn();
  const { getByTestId } = render(
    <Wrapper>
      <FormItemContext.Provider value={formItemState}>
        <Field
          as="input"
          name="userName"
          onChange={onChange}
          data-testid="field"
        />
      </FormItemContext.Provider>
    </Wrapper>,
  );

  fireEvent.change(getByTestId('field'), { target: { value: '李四' } });
});

it('失去焦点', () => {
  const { getByTestId } = render(
    <Wrapper>
      <FormItemContext.Provider value={formItemState}>
        <Field as="input" name="userName" data-testid="field" />
      </FormItemContext.Provider>
    </Wrapper>,
  );

  fireEvent.focus(getByTestId('field'));
  fireEvent.blur(getByTestId('field'));
});

it('指定valueExtra时，监听值变更', () => {
  const handleChange = jest.fn();
  const onChange = jest.fn();
  const { getByTestId } = render(
    <Wrapper>
      <FormItemContext.Provider value={formItemState}>
        <Field
          as="input"
          name="userName"
          valueExtract={handleChange}
          onChange={onChange}
          data-testid="field"
        />
      </FormItemContext.Provider>
    </Wrapper>,
  );

  fireEvent.change(getByTestId('field'), { target: { value: '李四' } });

  expect(onChange).toBeCalledTimes(1);
  expect(handleChange).toHaveBeenCalledTimes(1);
});

it('value不存在时，显示默认值', () => {
  const { getByTestId } = render(
    <Wrapper>
      <FormItemContext.Provider value={formItemState}>
        <Field
          as="input"
          name="firstName"
          defaultValue="默认值"
          data-testid="field"
        />
      </FormItemContext.Provider>
    </Wrapper>,
  );

  expect(getByTestId('field')).toHaveAttribute('value', '默认值');
});

it('每次渲染时，只commit一次', () => {
  let count = 0;

  function Child() {
    count += 1;

    return null;
  }

  render(
    <Wrapper>
      <Field as={Child} name="count" />
    </Wrapper>,
  );

  expect(count).toBe(1);
});
