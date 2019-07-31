import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import useFormState from './useFormState';
import FormStateContext from './FormStateContext';
import FieldArray from './FieldArray';

const Wrapper = ({
  children,
  initialValues = { nums: [1, 2, 3] },
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

it('渲染数组表单域', () => {
  const { container } = render(
    <Wrapper>
      <FieldArray name="nums">
        {(helpers) => <div>{helpers.items.length}</div>}
      </FieldArray>
    </Wrapper>,
  );

  expect(container).toHaveTextContent('3');
});
