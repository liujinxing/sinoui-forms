import React, { useMemo } from 'react';
import { BehaviorSubject } from 'rxjs';
import { render, act, cleanup } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useBehaviorSubject from './useBehaviorSubject';

afterEach(cleanup);

it('基本的订阅模式', () => {
  const subject = new BehaviorSubject('1');
  const log: string[] = [];
  function Subscription() {
    const selector = useMemo(() => (state: string) => state, []);
    const value = useBehaviorSubject(subject, selector);
    log.push(value);
    return <div>{value}</div>;
  }

  // 第一次渲染组件时即获取到subject的数据
  const { unmount } = render(<Subscription />);
  expect(log).toEqual(['1']);

  // subject发送新的数据，Subscription组件重绘，并获取到最新的数据
  act(() => {
    subject.next('2');
  });
  expect(log).toEqual(['1', '2']);

  // 卸载Subscription组件同时取消subject的订阅
  unmount();
  subject.next('3');
  expect(log).toEqual(['1', '2']);
});

it('当数据源发生变化时，应立即获取到新数据源的数据，且不会发生二次渲染的问题', () => {
  const subjectA = new BehaviorSubject('a1');
  const subjectB = new BehaviorSubject('b1');
  const log: string[] = [];

  const selector = (state: string) => state;
  function Subscription({ subject }: { subject: BehaviorSubject<string> }) {
    const value = useBehaviorSubject(subject, selector);

    log.push(value);

    return <div>{value}</div>;
  }

  const { rerender } = render(<Subscription subject={subjectA} />);
  expect(log).toEqual(['a1']);

  // 切换到subjectB后，立即获取到subjectB的数据
  rerender(<Subscription subject={subjectB} />);
  expect(log).toEqual(['a1', 'b1']);

  // 往subjectA发送数据，对Subscription无影响
  act(() => {
    subjectA.next('a2');
  });
  expect(log).toEqual(['a1', 'b1']);

  // subjectB发送数据，Subscription重绘，并收到新的数据
  act(() => {
    subjectB.next('b2');
  });
  expect(log).toEqual(['a1', 'b1', 'b2']);
});

it('当选择器发生变化时，应立即获取到新数据', () => {
  const subject = new BehaviorSubject('1');
  const log: string[] = [];

  const selectorA = (state: string) => `A: ${state}`;
  const selectorB = (state: string) => `B: ${state}`;

  function Subscription({ selector }: { selector: (state: string) => string }) {
    const value = useBehaviorSubject(subject, selector);

    log.push(value);

    return <div>{value}</div>;
  }

  const { rerender } = render(<Subscription selector={selectorA} />);
  expect(log).toEqual(['A: 1']);

  // 更换selectorB，立即获取到新的数据
  rerender(<Subscription selector={selectorB} />);
  expect(log).toEqual(['A: 1', 'B: 1']);

  act(() => {
    subject.next('2');
  });

  expect(log).toEqual(['A: 1', 'B: 1', 'B: 2']);
});

it('在commit阶段之前忽略发送的数据', () => {
  const subject = new BehaviorSubject('1');
  const log: string[] = [];
  function Subscription() {
    const selector = useMemo(() => (state: string) => state, []);
    const value = useBehaviorSubject(subject, selector);
    log.push(value);
    return <div>{value}</div>;
  }

  render(<Subscription />);
  expect(log).toEqual(['1']);

  // 开始更新react（相当于render阶段），subject发送多个值，但是都会忽略，直到commit阶段，应用最新的值
  act(() => {
    subject.next('2');
    subject.next('3');
    subject.next('4');
  });
  expect(log).toEqual(['1', '4']);
});

it('在commit阶段之前，忽略新的subject发送的数据', () => {
  const subjectA = new BehaviorSubject('a1');
  const subjectB = new BehaviorSubject('b1');
  const log: string[] = [];

  const selector = (state: string) => state;
  function Subscription({ subject }: { subject: BehaviorSubject<string> }) {
    const value = useBehaviorSubject(subject, selector);

    log.push(value);

    return <div>{value}</div>;
  }

  const { rerender } = render(<Subscription subject={subjectA} />);

  // 开始更新react（开启render阶段）
  act(() => {
    // 更新为subjectB
    rerender(<Subscription subject={subjectB} />);
    // 忽略subjectB的值
    expect(log).toEqual(['a1']);

    // 在未提交前向发送一些数据
    subjectB.next('b2');
    subjectB.next('b3');
    subjectB.next('b4');

    // 忽略subjectB发送的值
    expect(log).toEqual(['a1']);
  });
  // commit阶段应用subjectB最新的值
  expect(log).toEqual(['a1', 'b4']);

  // 再次更换
  act(() => {
    rerender(<Subscription subject={subjectA} />);
  });
  expect(log).toEqual(['a1', 'b4', 'a1']);
});

it('不应丢弃在render阶段更换subject时，旧subject发送的值', () => {
  const subjectA = new BehaviorSubject('a1');
  const subjectB = new BehaviorSubject('b1');
  const log: string[] = [];

  const selector = (state: string) => state;
  function Subscription({ subject }: { subject: BehaviorSubject<string> }) {
    const value = useBehaviorSubject(subject, selector);

    log.push(value);

    return <div>{value}</div>;
  }

  const { rerender } = render(<Subscription subject={subjectA} />);

  act(() => {
    rerender(<Subscription subject={subjectB} />);

    subjectA.next('a2');
    subjectA.next('a3');

    rerender(<Subscription subject={subjectA} />);
  });

  expect(log).toEqual(['a1', 'a3']);
});

it('通过路径获取数据', () => {
  const subject = new BehaviorSubject({ itemA: 'a', itemB: 'b' });
  const { result, rerender } = renderHook((path: string = 'itemA') =>
    useBehaviorSubject(subject, path),
  );

  expect(result.current).toBe('a');

  subject.next({ itemA: 'a2', itemB: 'b' });
  expect(result.current).toBe('a2');

  act(() => {
    rerender('itemB');
  });

  expect(result.current).toBe('b');
});

it('获取整个状态', () => {
  const subject = new BehaviorSubject({ itemA: 'a', itemB: 'b' });
  const { result } = renderHook(() => useBehaviorSubject(subject));

  expect(result.current).toEqual({
    itemA: 'a',
    itemB: 'b',
  });
});

it('浅比较', () => {
  const subject = new BehaviorSubject({ itemA: 'a', itemB: 'b', itemC: 'c' });
  const log = [];
  const selector = (state: { itemA: string; itemB: string; itemC: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { itemB, ...rest } = state;
    return rest;
  };
  renderHook(() => {
    const state = useBehaviorSubject(subject, selector);
    log.push(state);
    return state;
  });

  act(() => {
    subject.next({
      itemA: 'a',
      itemB: 'x',
      itemC: 'c',
    });
  });

  expect(log.length).toBe(1);
});

it('定制比较规则', () => {
  const subject = new BehaviorSubject({ itemA: 'a', itemB: 'b', itemC: 'c' });
  const log = [];
  const selector = (state: { itemA: string; itemB: string; itemC: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { itemB, ...rest } = state;
    return rest;
  };
  renderHook(() => {
    const state = useBehaviorSubject(subject, selector, Object.is);
    log.push(state);
    return state;
  });

  act(() => {
    subject.next({
      itemA: 'a',
      itemB: 'x',
      itemC: 'c',
    });
  });

  expect(log.length).toBe(3);
});
