/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { FormState, FormStateContext } from '@sinoui/rx-form-state';
import classNames from 'classnames';

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
    labelProps = {},
    className,
    ...others
  } = props;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formState.submit();
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formState.reset();
  };

  const context = useMemo(() => {
    return {
      ...formState,
      sinouiForm: { ...props, colon, labelProps },
    };
  }, [colon, formState, labelProps, props]);

  return (
    <FormStateContext.Provider value={context}>
      <form
        className={classNames('sinoui-forms', className)}
        onSubmit={handleSubmit}
        onReset={handleReset}
        {...others}
      >
        {children}
      </form>
    </FormStateContext.Provider>
  );
}
