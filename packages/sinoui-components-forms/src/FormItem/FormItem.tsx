/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import React, { useMemo } from 'react';
import classNames from 'classnames';
import memoize from 'lodash/memoize';
import {
  useFormStateContext,
  FieldConfig,
  FieldValidateProps,
} from '@sinoui/rx-form-state';
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
 * 获取状态
 * @param fields 表单域
 * @param path 获取状态名称
 */
function getState(
  fields: (Partial<FieldConfig> &
    FieldValidateProps & { readOnly?: boolean; disabled?: boolean })[],
  path: 'required' | 'readOnly' | 'disabled',
) {
  const idx = fields.findIndex((field) => field[path]);
  if (idx !== -1) {
    return true;
  }
  return false;
}

/**
 * 获取标签配置
 *
 * @param {any} children
 * @returns
 */
const getLabel = memoize((children) => {
  let label;
  let props;

  React.Children.forEach(children, (comp) => {
    if (comp && comp.type && comp.type.displayName === 'Label') {
      label = comp;
      // eslint-disable-next-line prefer-destructuring
      props = comp.props;
    }
  });

  return { label, props };
});

/**
 * 渲染标签
 */
function renderLabel(
  label: React.ReactNode,
  children: React.ReactNode,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labelProps: any,
) {
  if (label && typeof label === 'string') {
    return <Label {...labelProps}>{label}</Label>;
  }
  if (label) {
    return label;
  }
  const { label: labelComp, props } = getLabel(children);
  if (labelComp) {
    let finalTitle;
    const newProps = props || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { title: propsTitle, style: propsStyle = {} } = props as any;

    if (typeof propsTitle === 'function') {
      const { name } = labelProps;
      finalTitle = propsTitle(name);
      // 如果有对比的差异，变更label的颜色，暂时先写死，后期调整
      if (finalTitle) {
        (newProps as any).style = { ...propsStyle, color: '#f44336' };
      }
    } else {
      finalTitle = propsTitle;
    }

    return React.cloneElement(labelComp as any, {
      ...labelProps,
      ...newProps,
      title: finalTitle,
    });
  }
  return null;
}

/**
 * 表单项组件
 */
function FormItem(props: Props) {
  const { sinouiForm } = useFormStateContext();
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

  const context = useFormItemState(nameProp);
  const { fields } = context;

  const inline = (sinouiForm && sinouiForm.inline) || inlineProp;
  const vertical = (sinouiForm && sinouiForm.vertical) || verticalProp;
  const readOnly = readOnlyProp || getState(fields, 'readOnly');
  const disabled = disabledProp || getState(fields, 'disabled');

  const formItemState = useMemo(
    () => ({
      ...context,
      inline,
      vertical,
      readOnly,
      disabled,
    }),
    [context, disabled, inline, readOnly, vertical],
  );

  const name = nameProp || (fields.length > 0 ? fields[0].name : undefined);

  /**
   * 获取宽度用于grid布局
   */
  const labelWidth =
    (getLabel(children).props && (getLabel(children) as any).props.width) ||
    (sinouiForm && sinouiForm.labelProps && sinouiForm.labelProps.width) ||
    '120px';

  return (
    <FormItemContext.Provider value={formItemState}>
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
        labelWidth={labelWidth}
        vertical={vertical}
        style={style}
      >
        {renderLabel(label, children, {
          name,
        })}
        <FormItemContent style={contentStyle} readOnly={readOnly}>
          {children}
        </FormItemContent>
        {!inline && <FormItemError />}
      </FormItemContainer>
    </FormItemContext.Provider>
  );
}

export default FormItem;
