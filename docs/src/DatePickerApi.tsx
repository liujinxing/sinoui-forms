import React from 'react';

interface Props {
  /**
   * 值发生变更时的回调函数
   */
  onChange?: (event: any, value: string) => void;
  /**
   * 是否禁止选择当前日期之前的日期
   */
  todayBeforeForbidden?: boolean;
  /**
   * 只是选择年月
   */
  onlyYearMonth?: boolean;
  /**
   * 是否隐藏图标
   */
  hideIcon?: boolean;
}

function DatePickerApi(props: Props) {
  return <div {...props} />;
}

export default DatePickerApi;
