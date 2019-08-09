/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { FormState, FormStateContext } from '@sinoui/rx-form-state';
import classNames from 'classnames';
import SinouiFormStateContext from './SinouiFormStateContext';

export interface Props {
  /**
   * 表单状态
   */
  formState: FormState<any>;
  children?: React.ReactNode;
  /**
   * 标签内容后是否有冒号
   */
  colon?: boolean;
  /**
   * 标签与表单域是否水平布局
   */
  inline?: boolean;
  /**
   * 标签与表单域是否垂直布局
   */
  vertical?: boolean;
  /**
   * label的一些配置
   */
  labelProps?: any;
  /**
   * 自定义样式类名称
   */
  className?: string;
  /**
   * 自定义表单样式
   */
  style?: React.CSSProperties;
}

export default function Form(props: Props) {
  const {
    formState,
    children,
    colon = false,
    vertical,
    inline,
    className,
    ...others
  } = props;
  const propsRef = useRef(props);

  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  /**
   * 表单提交
   */
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      formState.submit();
    },
    [formState],
  );

  /**
   * 表单重置
   */
  const handleReset = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      formState.reset();
    },
    [formState],
  );

  /**
   * sinouiFormState的值
   */
  const context = useMemo(() => {
    return {
      labelProps: propsRef.current.labelProps,
      colon,
      vertical,
      inline,
    };
  }, [colon, inline, vertical]);

  return (
    <FormStateContext.Provider value={formState}>
      <SinouiFormStateContext.Provider value={context}>
        <form
          className={classNames('sinoui-forms', className)}
          onSubmit={handleSubmit}
          onReset={handleReset}
          {...others}
        >
          {children}
        </form>
      </SinouiFormStateContext.Provider>
    </FormStateContext.Provider>
  );
}
