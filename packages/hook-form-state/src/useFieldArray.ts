/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo } from 'react';
import { get, set } from 'lodash';
import { produce } from 'immer';
import FormStateContext from './FormStateContext';
import { FormState } from './types';

function useFieldArray<T>(name: string) {
  const formState = useContext(FormStateContext);
  const items: T[] = useMemo(() => get(formState.values, name) || [], [
    formState.values,
    name,
  ]);

  const createUpdate = (
    stateName: keyof FormState<T>,
    setStateFn: keyof FormState<T>,
  ) => (updater: (items: any[]) => void) => {
    const newState = produce(formState[stateName], (draft: any) => {
      const newItems = get(draft, name) || [];
      updater(newItems);
      set(draft, name, newItems);
    });

    formState[setStateFn](newState);
  };

  const updateValue = createUpdate('values', 'setValues');
  const updateErrors = createUpdate('errors', 'setErrors');
  const updateAsyncErrors = createUpdate('asyncErrors', 'setAsyncErrors');
  const updatePending = createUpdate('isPending', 'setPending');
  const updateTouched = createUpdate('isTouched', 'setTouched');
  const updateOtherState = (updater: (newItems: any[]) => void) => {
    updateErrors(updater);
    updateAsyncErrors(updater);
    updatePending(updater);
    updateTouched(updater);
  };

  const push = (newItem: T) => {
    updateValue((newItems) => {
      newItems.push(newItem);
    });
  };

  const insert = (idx: number, value: T) => {
    updateValue((newItems) => {
      newItems.splice(idx, 0, value);
    });
    updateOtherState((newItems) => {
      newItems.splice(idx, 0, undefined);
    });
  };

  const remove = (idx: number) => {
    const updater = (newItems: any[]) => {
      newItems.splice(idx, 1);
    };
    updateValue(updater);
    updateOtherState(updater);
  };

  const move = (fromIdx: number, toIdx: number) => {
    const updater = (newItems: any) => {
      const [item] = newItems.splice(fromIdx, 1);
      newItems.splice(toIdx, 0, item);
    };
    updateValue(updater);
    updateOtherState(updater);
  };

  const swap = (indexA: number, indexB: number) => {
    const updater = (draft: any[]) => {
      const itemA = draft[indexA];
      draft[indexA] = draft[indexB];
      draft[indexB] = itemA;
    };
    updateValue(updater);
    updateOtherState(updater);
  };

  const replace = (index: number, item: T) => {
    updateValue((draft) => {
      draft[index] = item;
    });
  };

  const pop = () => {
    const updater = (newItems: any[]) => {
      newItems.pop();
    };
    updateValue(updater);
    updateOtherState(updater);
  };

  const unshift = (item: T) => {
    const updater = (newItems: any[]) => {
      newItems.unshift(item);
    };
    updateValue(updater);
    updateOtherState(updater);
  };

  const getFieldName = (index: number, fieldName?: string) => {
    return `${name}[${index}]${fieldName ? `.${fieldName}` : ''}`;
  };

  return {
    items,
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
}

export default useFieldArray;
