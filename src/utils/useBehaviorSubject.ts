import { BehaviorSubject } from 'rxjs';
import { useState, useEffect } from 'react';
import { get } from 'lodash';
import isEquare from 'shallowequal';
import { map, distinctUntilChanged } from 'rxjs/operators';

/**
 * 从主题中获取状态
 *
 * @param subject 主题
 * @param path 路径
 */
function useBehaviorSubject<T, U = T>(
  subject: BehaviorSubject<T>,
  path?: string,
): U {
  const [value, setValue] = useState<U>(() =>
    path ? get(subject.getValue(), path) : subject.getValue(),
  );

  useEffect(() => {
    const subscription = subject
      .pipe(
        map((item) => (path ? get(item, path) : item)),
        distinctUntilChanged(isEquare),
      )
      .subscribe(setValue);

    return () => {
      subscription.unsubscribe();
    };
  }, [path, subject]);

  return value;
}

export default useBehaviorSubject;
