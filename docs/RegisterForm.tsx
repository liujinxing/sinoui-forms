import React from 'react';
import Radio, { RadioGroup } from 'sinoui-components/Radio';
import useFormState, { FormItem, Label, Field, FormStateContext } from '../src';

const onSubmit = (values) => {
  // eslint-disable-next-line no-alert
  alert(`请确认信息后再提交，${JSON.stringify(values)}`);
};

export default function RegisterForm() {
  const formState = useFormState({}, { onSubmit });

  const validatePassword = (values) => {
    if (
      values &&
      values.confirmPassword &&
      values.confirmPassword !== values.password
    ) {
      return '两次输入密码必须保持一致';
    }

    return undefined;
  };

  return (
    <FormStateContext.Provider value={formState}>
      <div>
        <FormItem>
          <Label>用户名</Label>
          <Field
            name="userName"
            as="input"
            required
            compProps={{ placeholder: '用户名' }}
          />
        </FormItem>

        <FormItem>
          <Label>电子邮件</Label>
          <Field
            name="email"
            as="input"
            required
            compProps={{ placeholder: '电子邮箱' }}
          />
        </FormItem>

        <FormItem>
          <Label>密码</Label>
          <Field
            name="password"
            as="input"
            required
            minlength={6}
            compProps={{ placeholder: '密码', type: 'password' }}
          />
        </FormItem>
        <FormItem>
          <Label>确认密码</Label>
          <Field
            name="confirmPassword"
            as="input"
            required
            compProps={{ placeholder: '确认密码', type: 'password' }}
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
            minlength={4}
            maxlength={11}
            compProps={{ type: 'number', placeholder: '电话号码' }}
          />
        </FormItem>
        <FormItem>
          <Label>简介</Label>
          <Field
            name="note"
            as="input"
            compProps={{ placeholder: '请用一句话介绍自己' }}
          />
        </FormItem>
        <button type="submit" onClick={() => formState.onSubmit()}>
          注册
        </button>
      </div>
    </FormStateContext.Provider>
  );
}
