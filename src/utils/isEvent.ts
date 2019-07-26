/**
 * 判断是否是React事件
 *
 * @param event 事件
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isEvent(event: any): event is React.SyntheticEvent {
  return !!(event && event.target);
}

export default isEvent;
