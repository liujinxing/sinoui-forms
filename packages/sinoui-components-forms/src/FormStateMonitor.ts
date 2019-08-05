// eslint-disable-next-line import/no-unresolved
import { useFormStateContext, FormState } from '@sinoui/rx-form-state';

interface Props {
  /**
   * 指定表单值渲染器。当表单值发生变化时，就会调用此函数
   */
  children: (formState: FormState) => React.ReactElement | null;
}

/**
 * 表单状态监听组件
 * @param props
 */
export default function FormStateMonitor(props: Props) {
  const formState = useFormStateContext();

  return props.children(formState);
}
