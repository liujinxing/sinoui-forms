import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import useFormState from './useFormState';
import FormStateContext from './FormStateContext';
import Field from './Field';
import useFieldError from './useFieldError';
import useFieldTouched from './useFieldTouched';

const Wrapper = ({
  children,
  initialValues = { userName: '张三' },
  validate,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate?: (values: any) => any;
}) => {
  const formState = useFormState(initialValues, {
    validate,
  });
  return (
    <FormStateContext.Provider value={formState}>
      {children}
    </FormStateContext.Provider>
  );
};

afterEach(cleanup);

it('渲染表单域', () => {
  const { getByDisplayValue } = render(
    <Wrapper>
      <Field as="input" name="userName"></Field>
    </Wrapper>,
  );

  expect(getByDisplayValue('张三')).toBeDefined();
});

it('收集输入框值变化', () => {
  const { getByDisplayValue } = render(
    <Wrapper>
      <Field as="input" name="userName" />
    </Wrapper>,
  );

  const input = getByDisplayValue('张三') as HTMLInputElement;

  fireEvent.change(input, {
    target: {
      value: '李四',
    },
  });

  expect(input.value).toBe('李四');
});

it('输入框失去焦点后，显示表单错误状态', () => {
  const { getByDisplayValue } = render(
    <Wrapper
      validate={(values) => (values.userName ? {} : { userName: '必填' })}
    >
      <Field as="input" name="userName" />
    </Wrapper>,
  );

  const input = getByDisplayValue('张三') as HTMLInputElement;

  fireEvent.change(input, {
    target: {
      value: '',
    },
  });

  fireEvent.blur(input);

  expect(input.dataset.error).toBe('true');
});

it('指定默认值', () => {
  const { getByTestId } = render(
    <Wrapper initialValues={{}}>
      <Field as="input" name="userName" defaultValue="" />
    </Wrapper>,
  );

  const input = getByTestId('field-comp') as HTMLInputElement;

  expect(input.value).toBe('');
});

it('表单域校验', () => {
  const { getByTestId } = render(
    <Wrapper initialValues={{}}>
      <Field as="input" name="userName" required />
    </Wrapper>,
  );

  const input = getByTestId('field-comp') as HTMLInputElement;

  fireEvent.blur(input);

  expect(input.dataset.error).toBe('true');
});

it('email校验', () => {
  const emailRegexp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

  const ErrorMessage = () => {
    const error = useFieldError('email') || null;
    const isTouched = useFieldTouched('email');
    return <div data-testid="error">{isTouched ? error : null}</div>;
  };

  const { getByTestId } = render(
    <Wrapper initialValues={{ email: 'xx' }}>
      <Field
        as="input"
        name="email"
        pattern={emailRegexp.source}
        patternErrorMessage="不符合邮件地址规则。"
      />
      <ErrorMessage />
    </Wrapper>,
  );

  fireEvent.blur(getByTestId('field-comp'));

  expect(getByTestId('error')).toHaveTextContent('不符合邮件地址规则。');
});

it('onChange', () => {
  const onChange = jest.fn();
  const { getByTestId } = render(
    <Wrapper initialValues={{ email: 'xx' }}>
      <Field as="input" name="email" onChange={onChange} />
    </Wrapper>,
  );

  const event = {
    target: {
      value: 'xx2',
    },
  };
  fireEvent.change(getByTestId('field-comp'), event);

  expect(onChange).toBeCalled();
});

it('onBlur', () => {
  const onBlur = jest.fn();
  const { getByTestId } = render(
    <Wrapper>
      <Field as="input" name="email" onBlur={onBlur} />
    </Wrapper>,
  );

  fireEvent.blur(getByTestId('field-comp'));

  expect(onBlur).toBeCalled();
});
