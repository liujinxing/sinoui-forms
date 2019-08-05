/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-named-as-default */
import React from 'react';
import Dialog, {
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogProps,
} from 'sinoui-components/Dialog';
import styled from 'styled-components';
import { FormState } from '@sinoui/rx-form-state';
import Form, { Props as FormProps } from './Form';
import FormStateMonitor from './FormStateMonitor';

export interface Props extends FormProps {
  /**
   * 尺寸
   */
  size: 'normal' | 'big' | number;
  /**
   * 标题
   */
  title?: string;
  /**
   * 表单项
   */
  children: React.ReactNode;
  /**
   * 按钮组
   */
  actions?: (formState: FormState) => React.ReactElement | null;
  /**
   * 表单名称
   */
  name: string;
  open: boolean;
  onRequestClose: () => void;
}

const getSize = (size: number | string) => {
  if (size === 'normal') {
    return '70%';
  }
  if (size === 'big') {
    return '90%';
  }

  return `${size}px`;
};

const FormDialogWrapper = styled<
  {
    size: 'normal' | 'big' | number;
  } & DialogProps
>(Dialog)`
  width: ${(props) => getSize(props.size)};
  max-width: none;
`;

export default function FormDialog(props: Props) {
  const { open, onRequestClose, title, actions, size, ...others } = props;

  return (
    <FormDialogWrapper open={open} onRequestClose={onRequestClose} size={size}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <Form {...others} />
      </DialogContent>
      {actions && (
        <DialogActions>
          <FormStateMonitor>{actions}</FormStateMonitor>
        </DialogActions>
      )}
    </FormDialogWrapper>
  );
}
