/* eslint-disable import/no-unresolved */
import React from 'react';
import Typography from 'sinoui-components/Typography';
import paddingPropReceiver from 'sinoui-components/styled-components-utils/prop-receivers/padding';
import { useFieldValue } from '@sinoui/rx-form-state';

export interface Props {
  /**
   * 表单域名称
   */
  name?: string;
  /**
   * 对齐方式
   */
  verticalAlign?: 'top' | 'center' | 'bottom';
  /**
   * 前缀内容
   */
  prefix?: React.ReactNode;
  /**
   * 后缀内容
   */
  subfix?: React.ReactNode;
  /**
   * 文本内容
   */
  text?: string;
  /**
   * 自定义文本内容样式
   */
  contentStyle?: React.CSSProperties;
  /**
   * 定义FormText所占行数，内容超过部分会显示滚动条。一行48px。默认为undefined，表示不做高度约束。
   */
  line?: number;
  children?: React.ReactNode;
}

const VerticalAlignMap = {
  center: 'center',
  top: 'flex-start',
  bottom: 'flex-end',
};

export const FormTextWrapper = Typography.extend.attrs<Props>({
  type: 'subheading',
})`
  display: flex;
  flex: 1;
  align-items: ${(props) => VerticalAlignMap[props.verticalAlign || 'center']};

  ${(props) =>
    props.line &&
    props.line > 0 &&
    `
  height:${props.line * 48}px;
  overflow:auto;
  `};

  ${paddingPropReceiver};
  padding: 4px 0;
`;

export default function FormText(props: Props) {
  const {
    name,
    prefix,
    subfix,
    text,
    contentStyle,
    children,
    ...others
  } = props;
  const fieldValue = useFieldValue(name || '');
  return (
    <FormTextWrapper {...others}>
      {prefix}
      <div style={contentStyle}>{text || fieldValue || children}</div>
      {subfix}
    </FormTextWrapper>
  );
}
