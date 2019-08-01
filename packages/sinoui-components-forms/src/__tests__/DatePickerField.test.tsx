import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DatePicker from '../DatePickerField';
import Wrapper from './FormTestWrapper';

afterEach(cleanup);

it('渲染日期组件', () => {
  const { container } = render(
    <Wrapper>
      <DatePicker name="birthday" open />
    </Wrapper>,
  );

  expect(container.querySelector('.sinoui-date-picker')).toBeVisible();
});

it('监听值变更', () => {
  const { container } = render(
    <Wrapper>
      <DatePicker name="birthday" />
    </Wrapper>,
  );

  const dom = container.querySelector('.sinoui-date-picker') as HTMLElement;

  fireEvent.click(dom);

  const datePickerModal = document.body.querySelectorAll('h6');

  fireEvent.click(datePickerModal[21]);

  expect(container.querySelector('.sinoui-date-picker')).toHaveTextContent(
    '2019-08-17',
  );
  expect(document.body.querySelector('.appear-done')).toBeNull();
});
