/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { FormState, FormStateContext } from '@sinoui/rx-form-state';

interface Props {
  /**
   * 表单状态
   */
  formState: FormState<any>;
  children?: React.ReactNode;
  /**
   * 表单域标签内容后是否有冒号
   */
  colon?: boolean;
  /**
   * label的一些配置
   */
  labelProps?: any;
}

export default function Form(props: Props) {
  const {
    formState,
    children,
    colon = false,
    labelProps = {},
    ...others
  } = props;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formState.submit();
  };

  const context = useMemo(() => {
    return {
      ...formState,
      sinouiForm: { ...props, colon, labelProps },
    };
  }, [colon, formState, labelProps, props]);

  return (
    <FormStateContext.Provider value={context}>
      <form onSubmit={handleSubmit} {...others}>
        {children}
      </form>
    </FormStateContext.Provider>
  );
}
