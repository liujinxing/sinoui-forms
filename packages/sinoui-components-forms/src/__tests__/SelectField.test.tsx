import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SelectField from '../SelectField';
import Wrapper from './FormTestWrapper';

afterEach(cleanup);

it('渲染选择组件：多选', () => {
  const { container } = render(
    <Wrapper defaultValues={{ favs: ['1'] }}>
      <SelectField name="favs" multiple open>
        <option value="1">篮球</option>
        <option value="2">足球</option>
      </SelectField>
    </Wrapper>,
  );

  expect(container.querySelector('.sinoui-select__content')).toHaveTextContent(
    '篮球',
  );

  const secondMenuItem = document.body.querySelector(
    '#menu-favs li:last-child',
  ) as HTMLElement;
  fireEvent.click(secondMenuItem);

  expect(container.querySelector('.sinoui-select__content')).toHaveTextContent(
    '篮球, 足球',
  );
});

it('取消选择', () => {
  const { container } = render(
    <Wrapper defaultValues={{ favs: ['1'] }}>
      <SelectField name="favs" multiple open>
        <option value="1">篮球</option>
        <option value="2">足球</option>
      </SelectField>
    </Wrapper>,
  );

  const secondMenuItem = document.body.querySelector(
    '#menu-favs li',
  ) as HTMLElement;
  fireEvent.click(secondMenuItem);

  expect(
    container.querySelector('.sinoui-select__content'),
  ).not.toHaveTextContent('篮球');
});

it('单选', () => {
  const { container } = render(
    <Wrapper defaultValues={{ favs: ['1'] }}>
      <SelectField name="favs" open>
        <option value="1">篮球</option>
        <option value="2">足球</option>
      </SelectField>
    </Wrapper>,
  );

  const secondMenuItem = document.body.querySelector(
    '#menu-favs li:last-child',
  ) as HTMLElement;
  fireEvent.click(secondMenuItem);

  expect(
    container.querySelector('.sinoui-select__content'),
  ).not.toHaveTextContent('篮球');
  expect(container.querySelector('.sinoui-select__content')).toHaveTextContent(
    '足球',
  );
});
