/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import Radio, { RadioGroup } from 'sinoui-components/Radio';
import Form, { FormItem, Label, Field } from '@sinoui/web-forms';
import { useFormState } from '@sinoui/rx-form-state';

const onSubmit = (values: any) => {
  // eslint-disable-next-line no-alert
  alert(`请确认信息后再提交，${JSON.stringify(values)}`);
};

export default function RegisterForm() {
  const formState = useFormState({}, { onSubmit });

  const validatePassword = (value: any, values: any) => {
    if (value && values && value !== values.password) {
      return '两次输入密码必须保持一致';
    }

    return undefined;
  };

  return (
    <Form formState={formState}>
      <FormItem>
        <Label>用户名</Label>
        <Field name="userName" as="input" required placeholder="用户名" />
      </FormItem>

      <FormItem>
        <Label>电子邮件</Label>
        <Field name="email" as="input" required placeholder="电子邮箱" />
      </FormItem>

      <FormItem>
        <Label>密码</Label>
        <Field
          name="password"
          as="input"
          required
          minlength={6}
          placeholder="密码"
          type="password"
        />
      </FormItem>
      <FormItem>
        <Label>确认密码</Label>
        <Field
          name="confirmPassword"
          as="input"
          type="password"
          required
          placeholder="确认密码"
          validate={validatePassword}
        />
      </FormItem>
      <FormItem>
        <Label>性别</Label>
        <Field as={RadioGroup} name="sex">
          <Radio value="男">男</Radio>
          <Radio value="女">女</Radio>
          <Radio value="保密">保密</Radio>
        </Field>
      </FormItem>
      <FormItem>
        <Label>手机号码</Label>
        <Field
          as="input"
          name="telephone"
          type="number"
          placeholder="电话号码"
          minlength={4}
          maxlength={11}
        />
      </FormItem>
      <FormItem>
        <Label>简介</Label>
        <Field name="note" as="input" placeholder="请用一句话介绍自己" />
      </FormItem>
      <button type="submit">注册</button>
    </Form>
  );
}
