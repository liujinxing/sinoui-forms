import { useRef, useEffect } from 'react';

/**
 * 值ref hook。当做本地变量使用的ref。
 *
 * @template T
 * @param value
 * @returns
 */
function useValueRef<T>(value: T) {
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
}

export default useValueRef;
