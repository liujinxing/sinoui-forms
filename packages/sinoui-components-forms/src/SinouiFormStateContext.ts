import React from 'react';

export interface SinouiFormState {
  /**
   * 表单域标签内容后是否有冒号
   */
  colon: boolean;
  /**
   * label配置
   */
  labelProps?: any;
  /**
   * 表单标签和表单域水平布局
   */
  inline?: boolean;
  /**
   * 表单标签和表单域垂直布局
   */
  vertical?: boolean;
}

const SinouiFormStateContext = React.createContext<SinouiFormState>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  null as any,
);

export default SinouiFormStateContext;
