/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import FormControlWrapper from 'sinoui-components/Form/FormControl/FormControlWrapper';
import FormControlContent from 'sinoui-components/Form/FormControl/FormControlContent';
import memoize from 'lodash/memoize';
import { useFormStateContext } from '@sinoui/rx-form-state';
import FormItemError from './FormItemError';
import FormItemLabel from './FormItemLabel';

export interface Props {
  /**
   * 是否必填
   */
  required?: boolean;
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
   * 获取焦点
   */
  focused?: boolean;
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
   * 根据readOnly属性判定是否是必填项
   * 如果为true：只读时取消表单项的必填校验
   * 否则，沿用原来的逻辑判断是否为必填项
   */
  requiredByReadOnly?: boolean;
  /**
   * 内容样式
   */
  contentStyle?: React.CSSProperties;
}

export const StyledFormItemLabel = styled(FormItemLabel)`
  padding-top: 12px;
  padding-bottom: 0px;
  ${(props) => props.vertical && 'display:block;'};
`;

const StyledFormControlContent = styled(FormControlContent)`
  padding-bottom: 0px;
  align-self: flex-end;
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

  // tslint:disable-next-line:no-any
  React.Children.forEach(children, (comp: any) => {
    if (comp && comp.type && comp.type.displayName === 'Label') {
      label = comp.props.children;
      /* eslint prefer-destructuring: 0 */
      props = comp.props;
    }
  });

  return { label, props };
});

const getFormControlProps = memoize((children) => {
  let formControlProps: {
    name?: string;
    required?: boolean;
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
      const name = labelProps.name;
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

const getFieldRequired = (
  children: React.ReactNode,
  readOnly?: boolean,
  required?: boolean,
  requiredByReadOnly?: boolean,
) => {
  if (requiredByReadOnly) {
    if (!readOnly) {
      return required || getFormControlProps(children).required;
    }
    return false;
  }
  return required || getFormControlProps(children).required;
};

/**
 * 表单项组件
 */
function FormItem(props: Props) {
  const [focused, setFocused] = useState(false);
  const { sinouiForm } = useFormStateContext();

  const {
    label,
    required: requiredProp,
    disabled: disabledProp,
    readOnly: readOnlyProp,
    inline: inlineProp,
    vertical: verticalProp,
    name: nameProp,
    children,
    errorMessageType = 'normal',
    className,
    style,
    requiredByReadOnly,
    contentStyle,
  } = props;
  const name = nameProp || getFormControlProps(children).name;
  const readOnly = readOnlyProp || getFormControlProps(children).readOnly;
  const required = getFieldRequired(
    children,
    readOnly,
    requiredProp,
    requiredByReadOnly,
  );
  const disabled = disabledProp || getFormControlProps(children).disabled;
  const inline = (sinouiForm && sinouiForm.inline) || inlineProp;
  const vertical = (sinouiForm && sinouiForm.vertical) || verticalProp;
  const labelWidth =
    (getLabel(children).props && (getLabel(children) as any).props.width) ||
    (sinouiForm && sinouiForm.labelProps && sinouiForm.labelProps.width) ||
    '120px';

  const helpTextLeft = vertical ? '0px' : labelWidth;

  return (
    <>
      <StyledFormItemWrapper
        className={classNames(
          'sinoui-form-item',
          {
            'sinoui-form-item__inline': inline,
          },
          className,
        )}
        inline={inline}
        vertical={vertical}
        style={style}
      >
        {renderLabel(label, children, {
          name,
          required,
          disabled,
          readOnly,
          focused,
          inline,
          vertical,
        })}
        <StyledFormControlContent
          className="sinoui-form-item__content"
          style={contentStyle}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              // tslint:disable-next-line:no-any
              return React.cloneElement(child as any, { readOnly });
            }
            return child;
          })}
        </StyledFormControlContent>
      </StyledFormItemWrapper>
      {!inline && (
        <FormItemError
          name={name}
          errorMessageType={errorMessageType}
          paddingLeft={helpTextLeft}
        />
      )}
    </>
  );
}

export default FormItem;
