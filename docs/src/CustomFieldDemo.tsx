import React from 'react';
import { useFormState, FormValueMonitor } from '@sinoui/rx-form-state';
import Form, { FormItem, Label, Field } from '@sinoui/web-forms';

export function TextInput(props: any) {
  const { value, onChange } = props;
  return (
    <input
      {...props}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function TextInputField(props: any) {
  return <Field {...props} as={TextInput} valueExtract={(value) => value} />;
}

export function TextInputFieldDemo() {
  const formState = useFormState();

  return (
    <Form formState={formState}>
      <FormItem>
        <Label>用户名</Label>
        <TextInputField name="userName" type="text" />
      </FormItem>
      <FormItem>
        <Label>年龄</Label>
        <TextInputField name="age" type="number" />
      </FormItem>
      <FormValueMonitor>
        {(values) => <div>表单值：{JSON.stringify(values)}</div>}
      </FormValueMonitor>
    </Form>
  );
}
