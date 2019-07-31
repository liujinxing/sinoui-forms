import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Label from './Label';
import Field from './Field';
import FormItem from './FormItem';
import FormItemContext from './FormItemContext';
import Wrapper from './FormTestWrapper';

const formItemState = {
  name: 'userName',
  fields: ['userName', 'password'],
  id: 1,
  addField: jest.fn(),
  removeField: jest.fn(),
};

afterEach(cleanup);

it('无校验状态下FormItem的渲染', () => {
  const { getByTestId } = render(
    <Wrapper>
      <FormItemContext.Provider value={formItemState}>
        <FormItem>
          <Label>用户名</Label>
          <Field as="input" name="userName" />
        </FormItem>
      </FormItemContext.Provider>
    </Wrapper>,
  );

  expect(getByTestId('formItem')).toBeVisible();
});

it('校验出错时，会渲染错误信息', () => {
  const { getByTestId, getByText } = render(
    <Wrapper>
      <FormItemContext.Provider value={formItemState}>
        <FormItem>
          <Label>用户名</Label>
          <Field as="input" name="userName" required data-testid="field" />
        </FormItem>
      </FormItemContext.Provider>
    </Wrapper>,
  );

  fireEvent.change(getByTestId('field'), {
    target: {
      value: '',
    },
  });
  fireEvent.blur(getByTestId('field'));

  expect(getByTestId('fieldError')).toBeVisible();
  expect(getByText('用户名')).toHaveStyle('color:red');
});
