import React from 'react';

export interface Props {
  /**
   * 是否支持多行文本 如果为true，则输入框支持换行显示
   */
  multiline?: boolean;
  /**
   * 值发生变化时的回调函数
   */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

function TextInputField(props: Props) {
  return <div {...props} />;
}

export default TextInputField;
