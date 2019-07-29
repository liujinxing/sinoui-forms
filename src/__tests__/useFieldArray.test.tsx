import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useFieldArray from '../hook-form-state/useFieldArray';
import FormStateContext from '../hook-form-state/FormStateContext';
import useFormState from '../hook-form-state/useFormState';

const Wrapper = ({ children }: { children?: React.ReactNode }) => {
  const formState = useFormState({});
  return (
    <FormStateContext.Provider value={formState}>
      {children}
    </FormStateContext.Provider>
  );
};

it('useFieldArray初始化时，items为空数组', () => {
  const { result } = renderHook(() => useFieldArray('telephones'), {
    wrapper: Wrapper,
  });

  expect(result.current.items).toEqual([]);
});

it('push一条数据', async () => {
  const { result } = renderHook(() => useFieldArray('telephones'), {
    wrapper: Wrapper,
  });

  result.current.push({});

  expect(result.current.items.length).toBe(1);
});

it('insert一条数据', () => {
  const { result } = renderHook(() => useFieldArray('telephones'), {
    wrapper: Wrapper,
  });

  result.current.push({ type: '手机', telephone: '133XXXX8609' });
  result.current.push({});

  result.current.insert(1, { type: '电话', telephone: '4208' });

  expect(result.current.items.length).toBe(3);
  expect(result.current.items[1]).toEqual({ type: '电话', telephone: '4208' });
});

it('移除一条数据', () => {
  const { result } = renderHook(() => useFieldArray('telephones'), {
    wrapper: Wrapper,
  });

  result.current.push({ type: '手机', telephone: '133XXXX8609' });
  result.current.push({});

  result.current.insert(1, { type: '电话', telephone: '4208' });

  result.current.remove(1);

  expect(result.current.items.length).toBe(2);
  expect(result.current.items[1]).toEqual({});
});

it('移动数据', () => {
  const { result } = renderHook(() => useFieldArray('arrs'), {
    wrapper: Wrapper,
  });

  result.current.push('1');
  result.current.push('2');
  result.current.push('3');

  expect(result.current.items).toEqual(['1', '2', '3']);

  result.current.move(0, 2);

  expect(result.current.items).toEqual(['2', '3', '1']);

  result.current.move(1, 2);

  expect(result.current.items).toEqual(['2', '1', '3']);

  result.current.move(2, 1);
  expect(result.current.items).toEqual(['2', '3', '1']);

  result.current.move(2, 0);
  expect(result.current.items).toEqual(['1', '2', '3']);
});

it('上下移动', () => {
  const { result } = renderHook(() => useFieldArray('arrs'), {
    wrapper: Wrapper,
  });

  result.current.push('1');
  result.current.push('2');
  result.current.push('3');

  expect(result.current.items).toEqual(['1', '2', '3']);

  result.current.swap(0, 1);
  expect(result.current.items).toEqual(['2', '1', '3']);
});

it('替换数据', () => {
  const { result } = renderHook(() => useFieldArray('arrs'), {
    wrapper: Wrapper,
  });

  result.current.push('1');
  result.current.push('2');

  result.current.replace(1, '12');

  expect(result.current.items).toEqual(['1', '12']);
});

it('删除最后一条数据', () => {
  const { result } = renderHook(() => useFieldArray('arrs'), {
    wrapper: Wrapper,
  });

  result.current.push('1');
  result.current.push('2');

  result.current.pop();

  expect(result.current.items).toEqual(['1']);
});

it('在最前面新增一条数据', () => {
  const { result } = renderHook(() => useFieldArray('arrs'), {
    wrapper: Wrapper,
  });

  result.current.push('1');
  result.current.push('2');

  result.current.unshift('新增的数据');

  expect(result.current.items.length).toBe(3);
  expect(result.current.items).toEqual(['新增的数据', '1', '2']);
});

it('获取表单域名称', () => {
  const { result } = renderHook(() => useFieldArray('arrs'), {
    wrapper: Wrapper,
  });

  const fieldName = result.current.getFieldName(1);

  expect(fieldName).toBe('arrs[1]');

  result.current.push('1');
  result.current.push('2');
  const newFieldName = result.current.getFieldName(1, 'a');

  expect(newFieldName).toBe('arrs[1].a');
});
