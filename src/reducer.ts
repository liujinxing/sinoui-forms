/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from 'immer';
import { get, set } from 'lodash';
import { FormErrors, FormPending, FormTouched } from './types';

export interface State<T = any> {
  values: T;
  errors: FormErrors;
  asyncErrors: FormErrors;
  isPending: FormPending;
  isTouched: FormTouched;
  isSubmit: boolean;
}

interface SetFormValuesAction {
  type: 'SET_FORM_VALUES';
  payload: any;
}

interface SetSyncErrorsAction {
  type: 'SET_SYNC_ERRORS';
  payload: {
    errors: FormErrors;
  };
}

interface SetIsTouchedAction {
  type: 'SET_ISTOUCHED';
  payload: FormTouched;
}

interface AsyncValidateStartAction {
  type: 'ASYNC_VALIDATE_START';
  payload: { fieldName: string };
}

interface AsyncValidateSuccessAction {
  type: 'ASYNC_VALIDATE_SUCCESS';
  payload: {
    error: string | undefined;
    fieldName: string;
  };
}

interface AsyncValidateFailureAction {
  type: 'ASYNC_VALIDATE_FAILURE';
  payload: {
    fieldName: string;
  };
}

interface SubmitStartAction {
  type: 'SUBMIT_START';
  payload: {
    isTouched: FormTouched;
  };
}

interface SubmitSuccessAction {
  type: 'SUBMIT_SUCCESS';
}

interface SubmitFailureAction {
  type: 'SUBMIT_FAILURE';
}

/**
 * 设置表单域touched状态的action
 */
interface SetFieldTouchedAction {
  type: 'SET_FIELD_TOUCHED';
  payload: {
    fieldName: string;
  };
}

/**
 * 删除表单域的动作类型
 */
interface RemoveFieldAction {
  type: 'REMOVE_FIELD';
  payload: {
    fieldName: string;
  };
}

/**
 * 清除异步错误
 */
interface RemoveAsyncErrorAction {
  type: 'REMOVE_ASYNC_ERROR';
  payload: {
    fieldName: string;
  };
}

interface SetFormPendingAction {
  type: 'SET_FORM_PENDING';
  payload: {
    pending: FormPending;
  };
}

interface SetFormAsyncErrorsAction {
  type: 'SET_FORM_ASYNC_ERRORS';
  payload: {
    asyncErrors: FormErrors;
  };
}

interface SetFormTouchedAction {
  type: 'SET_FORM_TOUCHED';
  payload: {
    touched: FormTouched;
  };
}

type Action =
  | SetFormValuesAction
  | SetSyncErrorsAction
  | SetIsTouchedAction
  | AsyncValidateStartAction
  | AsyncValidateSuccessAction
  | AsyncValidateFailureAction
  | SubmitStartAction
  | SubmitSuccessAction
  | SubmitFailureAction
  | SetFieldTouchedAction
  | RemoveFieldAction
  | RemoveAsyncErrorAction
  | SetFormPendingAction
  | SetFormAsyncErrorsAction
  | SetFormTouchedAction;

export interface Reducer<T> {
  (state: State<T>, action: Action): State;
}

/**
 * 异步校验开始
 */
const asyncValidateStart = produce(
  (draft: State, action: AsyncValidateStartAction) => {
    const { fieldName } = action.payload;
    set(draft.isPending, fieldName, true);
  },
);

/**
 * 异步校验成功
 */
const asyncValidateSuccess = produce(
  (draft: State, action: AsyncValidateSuccessAction) => {
    const { fieldName, error } = action.payload;
    set(draft.isPending, fieldName, false);
    if (!get(draft.errors, fieldName)) {
      set(draft.asyncErrors, fieldName, error);
    }
  },
);

/**
 * 异步校验失败
 */
const asyncValidateFailure = produce(
  (draft: State, action: AsyncValidateFailureAction) => {
    const { fieldName } = action.payload;

    set(draft.isPending, fieldName, false);
  },
);

/**
 * 设置表单域touched状态
 */
const setFieldTouched = produce(
  (draft: State, action: SetFieldTouchedAction) => {
    const { fieldName } = action.payload;

    set(draft.isTouched, fieldName, true);
  },
);

/**
 * 删除表单域
 */
const removeField = produce((draft: State, action: RemoveFieldAction) => {
  const { fieldName } = action.payload;

  set(draft.isPending, fieldName, undefined);
  set(draft.isTouched, fieldName, undefined);
  set(draft.asyncErrors, fieldName, undefined);
  set(draft.errors, fieldName, undefined);
});

/**
 * 删除异步错误
 */
const removeAsyncError = produce(
  (draft: State, action: RemoveAsyncErrorAction) => {
    const { fieldName } = action.payload;

    set(draft.asyncErrors, fieldName, undefined);
    set(draft.isPending, fieldName, undefined);
  },
);

function reducer<T>(state: State<T>, action: Action): State<T> {
  switch (action.type) {
    case 'SET_FORM_VALUES':
      return {
        ...state,
        values: action.payload,
      };
    case 'SET_SYNC_ERRORS':
      return {
        ...state,
        errors: action.payload.errors,
      };
    case 'ASYNC_VALIDATE_START':
      return asyncValidateStart(state, action);
    case 'ASYNC_VALIDATE_SUCCESS':
      return asyncValidateSuccess(state, action);
    case 'ASYNC_VALIDATE_FAILURE':
      return asyncValidateFailure(state, action);
    case 'SET_FIELD_TOUCHED':
      return setFieldTouched(state, action);
    case 'REMOVE_FIELD':
      return removeField(state, action);
    case 'REMOVE_ASYNC_ERROR':
      return removeAsyncError(state, action);
    case 'SET_ISTOUCHED':
      return {
        ...state,
        isTouched: action.payload,
      };
    case 'SUBMIT_START':
      return {
        ...state,
        isTouched: action.payload.isTouched,
        isSubmit: true,
      };

    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isTouched: {},
        isSubmit: false,
      };
    case 'SUBMIT_FAILURE':
      return {
        ...state,
        isSubmit: false,
      };
    case 'SET_FORM_PENDING':
      return {
        ...state,
        isPending: action.payload.pending,
      };
    case 'SET_FORM_ASYNC_ERRORS':
      return {
        ...state,
        asyncErrors: action.payload.asyncErrors,
      };
    case 'SET_FORM_TOUCHED':
      return {
        ...state,
        isTouched: action.payload.touched,
      };
    default:
      return state;
  }
}

export default reducer;
