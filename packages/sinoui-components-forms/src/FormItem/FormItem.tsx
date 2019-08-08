/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import FormControlWrapper from 'sinoui-components/Form/FormControl/FormControlWrapper';
import memoize from 'lodash/memoize';
import { useFormStateContext } from '@sinoui/rx-form-state';
import FormItemError from './FormItemError';
import Label from '../Label';
import FormItemContent from './FormItemContent';
import FormItemContext from './FormItemContext';
import useFormItemState from './useFormItemState';

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
   * 提示类型
   */
  errorMessageType?: 'none' | 'normal' | 'tooltip';
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

export const StyledFormItemLabel = styled(Label)`
  padding-top: 12px;
  padding-bottom: 0px;
  ${(props) => props.vertical && 'display:block;'};
`;

const StyledFormItemWrapper = styled(FormControlWrapper)`
  & .sinoui-select-field {
    margin-top: 4px;
    width: 100%;
  }

  & .sinoui-select-field .sinoui-select__content {
    flex: 1;
  }

  & .sinoui-input-wrapper {
    margin-top: 4px;
  }
`;

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
      label = comp.props.children;
      // eslint-disable-next-line prefer-destructuring
      props = comp.props;
    }
  });

  return { label, props };
});

const getFormControlProps = memoize((children) => {
  let formControlProps: {
    name?: string;

    disabled?: boolean;
    readOnly?: boolean;
  } = {};

  // tslint:disable-next-line:no-any
  React.Children.forEach(children, (comp: React.ReactElement<any>) => {
    if (comp && comp.props && comp.props.name) {
      formControlProps = comp.props;
    }
  });

  return formControlProps;
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
    return <StyledFormItemLabel {...labelProps}>{label}</StyledFormItemLabel>;
  }
  if (label) {
    return label;
  }
  const { label: title, props } = getLabel(children);
  if (title) {
    let finalTitle;
    const newProps = props || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { title: propsTitle, style: propsStyle = {} } = props as any;

    if (typeof propsTitle === 'function') {
      const { name } = labelProps;
      finalTitle = propsTitle(name);
      // 如果有对比的差异，变更label的颜色，暂时先写死，后期调整
      if (finalTitle) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newProps as any).style = { ...propsStyle, color: '#f44336' };
      }
    } else {
      finalTitle = propsTitle;
    }
    return (
      <StyledFormItemLabel {...labelProps} {...newProps} title={finalTitle}>
        {title}
      </StyledFormItemLabel>
    );
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
    errorMessageType = 'normal',
    className,
    style,
    contentStyle,
  } = props;
  const name = nameProp || getFormControlProps(children).name;
  const readOnly = readOnlyProp || getFormControlProps(children).readOnly;

  const disabled = disabledProp || getFormControlProps(children).disabled;
  const inline = (sinouiForm && sinouiForm.inline) || inlineProp;
  const vertical = (sinouiForm && sinouiForm.vertical) || verticalProp;
  const labelWidth =
    (getLabel(children).props && (getLabel(children) as any).props.width) ||
    (sinouiForm && sinouiForm.labelProps && sinouiForm.labelProps.width) ||
    '120px';

  const helpTextLeft = vertical ? '0px' : labelWidth;

  const context = useFormItemState(name);

  return (
    <FormItemContext.Provider value={context}>
      <StyledFormItemWrapper
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
        {renderLabel(label, children, {
          name,
          disabled,
          readOnly,
          inline,
          vertical,
        })}
        <FormItemContent style={contentStyle} readOnly={readOnly}>
          {children}
        </FormItemContent>
      </StyledFormItemWrapper>
      {!inline && (
        <FormItemError
          name={name}
          errorMessageType={errorMessageType}
          paddingLeft={helpTextLeft}
        />
      )}
    </FormItemContext.Provider>
  );
}

export default FormItem;
