import { useMemo } from 'react';

let idSeed = 0;

/**
 * 获取id的hook
 */
function useId() {
  const id = useMemo(() => {
    idSeed += 1;
    return idSeed;
  }, []);

  return id;
}

export default useId;
