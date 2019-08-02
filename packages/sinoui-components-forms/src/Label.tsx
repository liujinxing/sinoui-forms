import React from 'react';

export interface LabelProps {
  /**
   * 标签名称
   */
  name?: string;
  htmlFor?: string;
  /**
   * 标签与表单域是否水平布局
   */
  inline?: boolean;
  /**
   * 标签与表单域是否垂直布局
   */
  vertical?: boolean;
  /**
   * 布局方式
   */
  align?: 'left' | 'right' | 'center';
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 标签内容
   */
  children?: React.ReactNode;
  /**
   * 自定义宽度
   */
  width?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Label(_props: LabelProps) {
  return null;
}

Label.displayName = 'Label';

export default Label;
