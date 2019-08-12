/* eslint-disable import/no-unresolved */
import {
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import { FieldConfig, FieldValidateProps } from '@sinoui/rx-form-state';
import { produce } from 'immer';
import useId from './useId';
import SinouiFormStateContext from '../SinouiFormStateContext';

interface Options {
  inlineProp?: boolean;
  verticalProp?: boolean;
  readOnlyProp?: boolean;
  disabledProp?: boolean;
}

/**
 * 获取状态
 * @param fields 表单域
 * @param path 获取状态名称
 */
function getState(
  fields: (Partial<FieldConfig> &
    FieldValidateProps & { readOnly?: boolean; disabled?: boolean })[],
  path: 'required' | 'readOnly' | 'disabled',
) {
  return fields.length > 0 && fields[0][path];
}

/**
 * 处理表单域的hook
 * @param name 表单域名称
 */
function useFormItemState(name: string | undefined, options?: Options) {
  const id = useId();
  const [fields, setFields] = useState<
    (Partial<FieldConfig> & FieldValidateProps)[]
  >([]);

  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  /**
   * 新增表单域
   *
   * @param {Partial<FieldConfig> & FieldValidateProps} field 表单域
   * @returns
   */
  const addField = useCallback(
    (field: Partial<FieldConfig> & FieldValidateProps) => {
      setFields(
        produce((draft: (Partial<FieldConfig> & FieldValidateProps)[]) => {
          const idx = draft.findIndex((item) => item.name === field.name);
          if (idx === -1) {
            draft.push(field);
          } else {
            draft.splice(idx, 1, field);
          }
        }),
      );
    },
    [],
  );

  /**
   * 删除表单域
   *
   * @param {string} fieldName 表单域名称
   * @returns
   */
  const removeField = useCallback((fieldName) => {
    setFields(
      produce((draft: (Partial<FieldConfig> & FieldValidateProps)[]) => {
        const idx = draft.findIndex((field) => field.name === fieldName);
        if (idx !== -1) {
          draft.splice(idx, 1);
        }
      }),
    );
  }, []);
  const { inlineProp, verticalProp, readOnlyProp, disabledProp } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    optionsRef.current || ({} as any);
  const sinouiFormState = useContext(SinouiFormStateContext);

  const inline =
    typeof inlineProp === 'boolean'
      ? inlineProp
      : sinouiFormState && sinouiFormState.inline;
  const vertical =
    typeof verticalProp === 'boolean'
      ? verticalProp
      : sinouiFormState && sinouiFormState.vertical;
  const readOnly =
    typeof readOnlyProp === 'boolean'
      ? readOnlyProp
      : getState(fields, 'readOnly');
  const disabled =
    typeof disabledProp === 'boolean'
      ? disabledProp
      : getState(fields, 'disabled');

  const context = useMemo(
    () => ({
      id,
      name,
      fields,
      addField,
      removeField,
      inline,
      vertical,
      readOnly,
      disabled,
    }),
    [
      id,
      name,
      fields,
      addField,
      removeField,
      inline,
      vertical,
      readOnly,
      disabled,
    ],
  );

  return context;
}

export default useFormItemState;
