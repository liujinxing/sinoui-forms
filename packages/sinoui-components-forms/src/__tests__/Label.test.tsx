import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Label from '../Label';
import Wrapper from './FormTestWrapper';

afterEach(cleanup);

it('渲染Label', () => {
  const { getByText } = render(
    <Wrapper>
      <Label>标签1</Label>
    </Wrapper>,
  );

  expect(getByText('标签1')).toBeVisible();
});
