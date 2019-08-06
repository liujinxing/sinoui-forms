/* eslint-disable @typescript-eslint/no-explicit-any */
import useFormStateContext from './useFormStateContext';
import useBehaviorSubject from './utils/useBehaviorSubject';
import { FormStateModel, FormState } from './types';

/**
 * 获取表单的提交中状态
 */
function useFormSubmitting(formState?: FormState) {
  const formStateFromContext = useFormStateContext();
  const innerFormState = formState || formStateFromContext;
  return useBehaviorSubject<FormStateModel<any>, boolean>(
    innerFormState.formState$,
    'isSubmitting',
  );
}

export default useFormSubmitting;
