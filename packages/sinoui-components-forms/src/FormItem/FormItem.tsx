/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import React, { useMemo } from 'react';
import classNames from 'classnames';
import FormItemError from './FormItemError';
import Label from '../Label';
import FormItemContent from './FormItemContent';
import FormItemContext from './FormItemContext';
import useFormItemState from './useFormItemState';
import FormItemContainer from './FormItemContainer';

export interface Props {
  /**
   * 不可用状态
   */
  disabled?: boolean;
  /**
   * 标签
   */
  label?: React.ReactNode;
  /**
   * 表单域名称
   */
  name?: string;
  /**
   * 子节点
   */
  children: React.ReactNode;
  /**
   * 标签和表单域控件水平布局
   */
  inline?: boolean;
  /**
   * 标签和表单域控件垂直布局
   */
  vertical?: boolean;
  /**
   * 只读状态
   */
  readOnly?: boolean;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 自定义样式类名
   */
  className?: string;
  /**
   * 内容样式
   */
  contentStyle?: React.CSSProperties;
}

/**
 * 获取标签配置
 *
 * @param {React.ReactNode} children
 * @returns
 */
function getLabel(children: React.ReactNode) {
  let label;

  React.Children.forEach(children, (comp: any) => {
    if (comp && comp.type && comp.type.displayName === 'Label') {
      label = comp;
    }
  });

  return label;
}

/**
 * 渲染标签
 */
function renderLabel(
  label: React.ReactNode,
  children: React.ReactNode,
  name?: string,
) {
  if (label && typeof label === 'string') {
    return <Label name={name}>{label}</Label>;
  }
  if (label) {
    return React.cloneElement(label as any, { name });
  }

  const child = getLabel(children);

  if (child) {
    return React.cloneElement(child as any, { name });
  }

  return child;
}

/**
 * 表单项组件
 */
function FormItem(props: Props) {
  const {
    label,
    disabled: disabledProp,
    readOnly: readOnlyProp,
    inline: inlineProp,
    vertical: verticalProp,
    name: nameProp,
    children,
    className,
    style,
    contentStyle,
  } = props;

  const context = useFormItemState(nameProp, {
    inlineProp,
    verticalProp,
    readOnlyProp,
    disabledProp,
  });
  const { fields, inline, vertical } = context;

  const name = nameProp || (fields.length > 0 ? fields[0].name : undefined);

  const newLabel = useMemo(() => renderLabel(label, children, name), [
    children,
    label,
    name,
  ]);

  return (
    <FormItemContext.Provider value={context}>
      <FormItemContainer
        className={classNames(
          'sinoui-form-item',
          {
            'sinoui-form-item__inline': inline,
            'sinoui-form-item__vertical': vertical,
          },
          className,
        )}
        inline={inline}
        vertical={vertical}
        style={style}
      >
        {newLabel}
        <FormItemContent style={contentStyle}>{children}</FormItemContent>
        {!inline && <FormItemError />}
      </FormItemContainer>
    </FormItemContext.Provider>
  );
}

export default FormItem;
