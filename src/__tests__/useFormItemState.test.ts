import { renderHook } from '@testing-library/react-hooks';
import useFormItemState from '../useFormItemState';

it('formItemState被定义', () => {
  const { result } = renderHook(() => useFormItemState('userName'));

  expect(result.current).toHaveProperty('id', 1);
  expect(result.current).toHaveProperty('name', 'userName');
});

it('添加Field', () => {
  const { result } = renderHook(() => useFormItemState('userName'));

  result.current.addField('password');
  expect(result.current.fields.length).toBe(1);

  result.current.addField('password');
  expect(result.current.fields.length).toBe(1);
});

it('删除Field', () => {
  const { result } = renderHook(() => useFormItemState('userName'));

  result.current.addField('password');
  result.current.removeField('fav');

  expect(result.current.fields.length).toBe(1);

  result.current.removeField('password');

  expect(result.current.fields.length).toBe(0);
});
