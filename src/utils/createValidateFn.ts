import isNaN from 'lodash/isNaN';

function createValidateFn(props: FieldValidateProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (value: any, values: any) => {
    if (props.required && !value) {
      return '必填';
    }

    if (
      props.trimRequired &&
      (!value || (value as string).trim().length === 0)
    ) {
      return '必填';
    }

    if (typeof props.max === 'number' && value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && props.max < numValue) {
        return `不能超过${props.max}`;
      }
    }

    if (typeof props.min === 'number' && value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && props.min > numValue) {
        return `不能小于${props.min}`;
      }
    }

    if (typeof props.minlength === 'number' && value) {
      if ((value as string).length < props.minlength) {
        return `长度不能小于${props.minlength}`;
      }
    }

    if (typeof props.maxlength === 'number' && value) {
      if ((value as string).length > props.maxlength) {
        return `长度不能大于${props.maxlength}`;
      }
    }

    if (props.pattern && value) {
      if (!new RegExp(`^(?:${props.pattern})$`, 'u').test(value)) {
        return (
          props.patternErrorMessage ||
          props.title ||
          `违反校验规则：${props.pattern}`
        );
      }
    }

    if (props.validate) {
      return props.validate(values);
    }

    return undefined;
  };
}

export default createValidateFn;
