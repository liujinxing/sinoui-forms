import { renderHook } from '@testing-library/react-hooks';
import useId from './useId';

it('验证生成id', () => {
  const { result } = renderHook(() => useId());

  expect(result.current).toBe(1);
});
