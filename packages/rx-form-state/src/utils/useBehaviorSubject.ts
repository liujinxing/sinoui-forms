import { BehaviorSubject } from 'rxjs';
import { useState, useEffect, useRef } from 'react';
import { get } from 'lodash';
import shallowequal from 'shallowequal';

function getValue<State, Value>(
  valueState: State,
  selector?: string | ((state: State) => Value),
) {
  if (!selector) {
    return valueState;
  }
  if (typeof selector === 'string') {
    return get(valueState, selector);
  }
  return selector(valueState);
}

/**
 * 从BehaviorSubject中提取数据
 *
 * @template State 主题中存储数据的接口
 * @template Value 返回值数据接口
 * @param {BehaviorSubject<State>} subject 主题
 * @param {(string | ((state: State) => Value))} [selector] 数据路径或者数据提取器（选择器）。可以为undefined，表示返回整个主题数据。
 * @param {(itemA: Value, itemB: Value) => boolean} [isEqual] 值相等性比较。默认为浅比较。
 * @returns {Value} 返回提取到的数据
 */
function useBehaviorSubject<State, Value>(
  subject: BehaviorSubject<State>,
  selector?: string | ((state: State) => Value),
  isEqual: (itemA: Value, itemB: Value) => boolean = shallowequal,
): Value {
  const [value, setValue] = useState(() => getValue(subject.value, selector));
  const stateRef = useRef({ value, subject, selector });
  const state = stateRef.current;

  let currentValue = state.value;
  if (state.subject !== subject || state.selector !== selector) {
    currentValue = getValue(subject.value, selector);

    stateRef.current = {
      value: currentValue,
      subject,
      selector,
    };
  }

  const isEqualRef = useRef(isEqual);

  if (isEqualRef.current !== isEqual) {
    isEqualRef.current = isEqual;
  }

  useEffect(() => {
    const subscription = subject.subscribe((valueState) => {
      const newValue = getValue(valueState, selector);
      const { value: oldValue } = stateRef.current;

      if (
        stateRef.current.selector === selector &&
        stateRef.current.subject === subject &&
        !isEqualRef.current(newValue, oldValue)
      ) {
        stateRef.current.value = newValue;
        setValue(newValue);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [subject, selector]);

  return currentValue;
}

export default useBehaviorSubject;
