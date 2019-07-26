import { renderHook } from '@testing-library/react-hooks';
import useFormState from './useFormState';

it('创建表单状态', () => {
  const { result } = renderHook(() => useFormState());

  expect(result.current.values$.value).toEqual({});
});

it('指定表单初始值', () => {
  const { result } = renderHook(() => useFormState({ userName: '张三' }));

  expect(result.current.values$.value).toEqual({ userName: '张三' });
});

it('指定表单校验逻辑和表单提交处理', () => {
  const onSubmit = jest.fn();
  onSubmit.mockResolvedValue('ok');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validate = ({ userName }: any) =>
    userName ? {} : { userName: '姓名不能为空' };
  const { result } = renderHook(() => useFormState({}, { onSubmit, validate }));

  result.current.validate();

  expect(result.current.errors$.value).toEqual({
    userName: '姓名不能为空',
  });

  result.current.setFieldValue('userName', '张三');

  expect(result.current.errors$.value).toEqual({});

  result.current.submit();

  expect(onSubmit).toHaveBeenCalledWith(result.current.values$.value);
});
