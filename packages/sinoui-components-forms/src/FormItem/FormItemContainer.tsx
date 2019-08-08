import styled, { css } from 'styled-components';

export interface FormItemContainerProps {
  /**
   * 水平布局
   */
  inline?: boolean;
  /**
   * 垂直布局
   */
  vertical?: boolean;
  /**
   * 标签宽度
   */
  labelWidth: string;
}

const defaultStyle = css`
  display: -ms-grid;
  display: grid;

  -ms-grid-columns: ${(props: FormItemContainerProps) => props.labelWidth} 1fr;
  -ms-grid-rows: auto auto;

  grid-template-columns: ${(props: FormItemContainerProps) => props.labelWidth} 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    'label content'
    '. error';

  & .sinoui-form-item-label {
    -ms-grid-row: 1;
    -ms-grid-column: 1;
    grid-area: label;
  }

  & .sonoui-form-item__content {
    -ms-grid-row: 1;
    -ms-grid-column: 2;

    grid-area: content;
    align-self: bottom;
  }

  & .sinoui-form-item-error {
    -ms-grid-row: 2;
    -ms-grid-column: 2;
    grid-area: error;
  }
`;

/**
 * 表单控件容器
 *
 * @ReactComponent
 */
const FormControlWrapper = styled.div<FormItemContainerProps>`
  min-height: 40px;
  box-sizing: border-box;
  padding: 0;
  ${(props) => !props.vertical && defaultStyle};

  & .sinoui-input-wrapper {
    margin-top: 4px;
  }

  & .sinoui-select-field {
    margin-top: 4px;
    width: 100%;
  }

  & .sinoui-select-field .sinoui-select__content {
    flex: 1;
  }

  & .sinoui-form-item__content > .sinoui-form-field > .sinoui-date-picker {
    min-width: 120px;
  }

  & .sinoui-form-label {
    padding-top: 12px;
    padding-bottom: 0px;
    ${(props) => props.vertical && 'display:block;'};
  }
`;

export default FormControlWrapper;
