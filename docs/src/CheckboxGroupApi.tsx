import React from 'react';

interface Props {
  /**
   * 值变更时的回调函数
   */
  onChange?: (values?: any[]) => void;
  /**
   * 是否以字符串的形式存储值，默认为false
   */
  stringValue?: boolean;
}

function CheckboxGroupApi(props: Props) {
  return <div {...props} />;
}

export default CheckboxGroupApi;
