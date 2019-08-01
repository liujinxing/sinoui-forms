import React from 'react';

export interface Props {
  /**
   * 值改变时的回调函数
   */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string | number,
  ) => void;
}

function RadioGroupApi(props: Props) {
  return <input {...props} />;
}

export default RadioGroupApi;
