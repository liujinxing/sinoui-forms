import React from 'react';

interface Props {
  /**
   * 选中状态改变时的回调函数
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * 选中状态
   */
  checked?: boolean;
}

function CheckboxFieldApi(props: Props) {
  return <input type="checkbox" {...props} />;
}

export default CheckboxFieldApi;
