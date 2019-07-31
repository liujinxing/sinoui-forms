import reducer from '../reducer';

const defaultState = {
  values: { userName: '张三' },
  errors: { userName: undefined },
  asyncErrors: { userName: undefined },
  isPending: { userName: undefined },
  isTouched: { userName: true },
  isSubmit: false,
};

it('ASYNC_VALIDATE_START', () => {
  const result = reducer(defaultState, {
    type: 'ASYNC_VALIDATE_START',
    payload: { fieldName: 'userName' },
  });

  expect(result.isPending).toEqual({ userName: true });
});

it('ASYNC_VALIDATE_SUCCESS', () => {
  const result = reducer(defaultState, {
    type: 'ASYNC_VALIDATE_SUCCESS',
    payload: { fieldName: 'userName', error: '用户名已经存在' },
  });

  expect(result.isPending).toEqual({ userName: false });
  expect(result.asyncErrors).toEqual({ userName: '用户名已经存在' });
});

it('ASYNC_VALIDATE_FAILURE', () => {
  const result = reducer(defaultState, {
    type: 'ASYNC_VALIDATE_FAILURE',
    payload: { fieldName: 'userName' },
  });

  expect(result.isPending).toEqual({ userName: false });
});

it('SET_IS_TOUCHED', () => {
  const result = reducer(defaultState, {
    type: 'SET_ISTOUCHED',
    payload: { userName: false },
  });

  expect(result.isTouched).toEqual({ userName: false });
});

it('default', () => {
  const result = reducer(defaultState, { type: 'DEFAULT' });

  expect(result).toEqual(defaultState);
});
