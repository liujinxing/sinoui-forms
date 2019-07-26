import { BehaviorSubject } from 'rxjs';
import { useState, useEffect } from 'react';
import { map, distinctUntilChanged } from 'rxjs/operators';
import isEquare from 'shallowequal';

/**
 * 使用选择器获取主题中的数据
 *
 * @param subject 主题
 * @param selector 状态选择器
 *
 * @returns 返回获取到的数据
 */
function useBehaviorSubjectSelect<T, U>(
  subject: BehaviorSubject<T>,
  selector: (state: T) => U,
): U {
  const [value, setValue] = useState(() => selector(subject.value));

  useEffect(() => {
    subject
      .pipe(
        map(selector),
        distinctUntilChanged(isEquare),
      )
      .subscribe(setValue);
  }, [subject, selector]);

  return value;
}

export default useBehaviorSubjectSelect;
