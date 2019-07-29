import React from 'react';
import Form, { Field, FormItem, useFormState, Label } from '../src';
import TelephoneForm from './TelephoneForm';
import AddressForm from './AddressForm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onSubmit(values: any) {
  // eslint-disable-next-line no-alert
  alert(JSON.stringify(values, undefined, 2));
}

function AddContactForm() {
  const formState = useFormState({}, { onSubmit });
  return (
    <Form formState={formState}>
      <FormItem>
        <Label>姓氏</Label>
        <Field as="input" type="text" name="firstName" required />
      </FormItem>
      <FormItem>
        <Label>名字</Label>
        <Field as="input" type="text" name="lastName" required />
      </FormItem>
      <FormItem>
        <Label>公司</Label>
        <Field as="input" type="text" name="company" />
      </FormItem>

      <TelephoneForm />
      <AddressForm />
      <FormItem>
        <Label>备注</Label>
        <Field as="input" name="note" />
      </FormItem>
      <button style={{ marginTop: 8, marginBottom: 8 }} type="submit">
        提交
      </button>
    </Form>
  );
}

export default AddContactForm;
