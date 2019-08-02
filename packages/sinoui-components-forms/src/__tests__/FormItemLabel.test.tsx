import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormItemLabel from '../FormItem/FormItemLabel';
import Wrapper from './FormTestWrapper';

afterEach(cleanup);

it('渲染Label', () => {
  const { getByText } = render(
    <Wrapper>
      <FormItemLabel>标签1</FormItemLabel>
    </Wrapper>,
  );

  expect(getByText('标签1')).toBeVisible();
});
