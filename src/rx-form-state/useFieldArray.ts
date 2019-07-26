/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { get, set } from 'lodash';
import useFormStateContext from './useFormStateContext';
import useBehaviorSubject from '../utils/useBehaviorSubject';
import { FormStateModel } from './types';

const defaultItems: any[] = [];

/**
 * 获取数组类型的表单域状态以及辅助方法
 *
 * @param fieldName 表单域名称
 */
function useFieldArray<T>(fieldName: string) {
  const formState = useFormStateContext();
  const items =
    useBehaviorSubject<FormStateModel, T[]>(formState.values$, fieldName) ||
    defaultItems;

  const actions = useMemo(() => {
    const createUpdate = (stateName: keyof FormStateModel) => (
      updater: (items: any[]) => void,
    ) => {
      formState.updateState((draft) => {
        const newState = draft[stateName];
        const newItems = get(newState, fieldName) || [];
        updater(newItems);
        set(newState, fieldName, newItems);
      });
    };

    const updateValues = createUpdate('values');
    const updateErrors = createUpdate('errors');
    const updateAsyncErrors = createUpdate('asyncErrors');
    const updatePending = createUpdate('isPending');
    const updateTounched = createUpdate('isTouched');
    const updateOtherState = (updater: (newItems: any[]) => void) => {
      updateErrors(updater);
      updateAsyncErrors(updater);
      updatePending(updater);
      updateTounched(updater);
    };

    /**
     * 新增数据
     *
     * @param item 需要新增的数据项
     */
    const push = (item: T) => {
      updateValues((values) => values.push(item));
    };

    /**
     * 插入数据
     *
     * @param index 数据插入的位置
     * @param item 需要插入的数据项
     */
    const insert = (index: number, item: T) => {
      updateValues((values) => values.splice(index, 0, item));
      updateOtherState((newItems) => newItems.splice(index, 0, undefined));
    };

    /**
     * 删除数据
     *
     * @param idx 需要删除数据项的索引位置
     */
    const remove = (idx: number) => {
      const updater = (newItems: any[]) => {
        newItems.splice(idx, 1);
      };
      updateValues(updater);
      updateOtherState(updater);
    };

    /**
     * 移动数据项
     *
     * @param fromIdx 数据项移动前的位置
     * @param toIdx 数据项移动后的位置
     */
    const move = (fromIdx: number, toIdx: number) => {
      const updater = (newItems: any) => {
        const [item] = newItems.splice(fromIdx, 1);
        newItems.splice(toIdx, 0, item);
      };
      updateValues(updater);
      updateOtherState(updater);
    };

    /**
     * 交换数据项
     *
     * @param indexA 需要交换的数据项1
     * @param indexB 需要交换的数据项2
     */
    const swap = (indexA: number, indexB: number) => {
      const updater = (draft: any[]) => {
        const itemA = draft[indexA];
        draft[indexA] = draft[indexB];
        draft[indexB] = itemA;
      };
      updateValues(updater);
      updateOtherState(updater);
    };

    /**
     * 替换数据项
     *
     * @param index 需要替换数据项的位置
     * @param item 新的数据
     */
    const replace = (index: number, item: T) => {
      updateValues((draft) => {
        draft[index] = item;
      });
    };

    /**
     * 移除数组的第一个数据项
     */
    const pop = () => {
      const updater = (newItems: any[]) => {
        newItems.pop();
      };
      updateValues(updater);
      updateOtherState(updater);
    };

    /**
     * 在数组的头部添加数据项
     *
     * @param item 新增的数据项
     */
    const unshift = (item: T) => {
      const updater = (newItems: any[]) => {
        newItems.unshift(item);
      };
      updateValues(updater);
      updateOtherState(updater);
    };

    /**
     * 获取表单域名称
     */
    const getFieldName = (index: number, subFieldName?: string) => {
      return `${fieldName}[${index}]${subFieldName ? `.${subFieldName}` : ''}`;
    };
    return {
      push,
      insert,
      remove,
      move,
      swap,
      replace,
      pop,
      unshift,
      getFieldName,
    };
  }, [formState, fieldName]);

  return {
    items,
    ...actions,
  };
}

export default useFieldArray;
