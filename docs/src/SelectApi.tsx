import React from 'react';

export interface Props {
  /**
   * 如果为true，多选选择框组件值为以逗号分割的字符串
   */
  stringValue?: boolean;
  /**
   * 值发生变化时的回调函数
   */
  onChange?: (
    event: React.ChangeEvent<HTMLSelectElement>,
    value: string | string[],
  ) => void;
}

function SelectApi(props: Props) {
  return <div {...props} />;
}

export default SelectApi;
