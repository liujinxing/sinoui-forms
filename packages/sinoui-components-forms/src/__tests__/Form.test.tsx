/* eslint-disable react/button-has-type */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useFormState } from '@sinoui/rx-form-state';
import { Label, FormItem, TextInput } from '@sinoui/sinoui-components-forms';
import Form from '../Form';
import Wrapper from './FormTestWrapper';

afterEach(cleanup);

it('渲染form', () => {
  function SimpleForm() {
    const defaultValue = { userName: '张三' };
    const onSubmit = jest.fn();
    const formState = useFormState(defaultValue, { onSubmit });
    return (
      <Form formState={formState}>
        <FormItem>
          <Label>用户名</Label>
          <TextInput name="userName" />
        </FormItem>
        <button type="submit">提交</button>

        <button type="reset">重置</button>
      </Form>
    );
  }
  const { container } = render(
    <Wrapper>
      <SimpleForm />
    </Wrapper>,
  );

  expect(container.querySelector('.sinoui-forms')).toBeInTheDOM();
});

const delay = () => {
  return Promise.resolve();
};

it('表单提交', async () => {
  const onSubmit = jest.fn();

  function SimpleForm() {
    const defaultValue = { userName: '张三' };
    const formState = useFormState(defaultValue, { onSubmit });
    return (
      <Form formState={formState}>
        <FormItem>
          <Label>用户名</Label>
          <TextInput name="userName" />
        </FormItem>
        <button type="submit">提交</button>

        <button type="reset">重置</button>
      </Form>
    );
  }
  const { getByText } = render(
    <Wrapper>
      <SimpleForm />
    </Wrapper>,
  );

  fireEvent.click(getByText('提交'));

  await delay();

  expect(onSubmit).toHaveBeenCalled();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findEventHandler(element: any, handlerName: string) {
  const props = Object.keys(element);

  const key = props.find((name) => name.startsWith('__reactEventHandlers'));

  return key ? element[key][handlerName] : null;
}

it('表单重置', () => {
  function SimpleForm() {
    const defaultValue = { userName: '张三' };
    const onSubmit = jest.fn();
    const formState = useFormState(defaultValue, { onSubmit });
    return (
      <Form formState={formState}>
        <FormItem>
          <Label>用户名</Label>
          <TextInput name="userName" />
        </FormItem>
        <button type="submit">提交</button>

        <button type="reset">重置</button>
      </Form>
    );
  }
  const { container } = render(
    <Wrapper>
      <SimpleForm />
    </Wrapper>,
  );

  const input = container.querySelector('input') as HTMLInputElement;

  fireEvent.change(input, { target: { value: '李四' } });

  expect(input.value).toBe('李四');

  findEventHandler(container.querySelector('form'), 'onReset')({
    preventDefault: jest.fn(),
  });

  expect(input.value).toBe('张三');
});
