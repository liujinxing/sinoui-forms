/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { useFieldArray } from '@sinoui/rx-form-state';
import { Field, FormItem } from '@sinoui/web-forms';

function AddressForm() {
  const {
    getFieldName: name,
    items,
    insert,
    remove,
    push,
    swap,
  } = useFieldArray('addresses');

  return (
    <div style={{ paddingTop: 16, paddingBottom: 16 }}>
      <label>添加地址</label>
      {items.map((_telephone, index) => (
        <div
          style={{
            display: 'flex',
            padding: 8,
            border: '1px solid green',
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <FormItem>
            <Field
              as="select"
              required
              name={name(index, 'country')}
              style={{ width: 160 }}
            >
              <option value="中国">中国</option>
              <option value="法国">法国</option>
              <option value="日本">日本</option>
              <option value="韩国">韩国</option>
            </Field>
          </FormItem>
          <FormItem>
            <Field
              name={name(index, 'city')}
              as="input"
              required
              placeholder="城市"
            />
          </FormItem>
          <FormItem>
            <Field name={name(index, 'street')} as="input" placeholder="街道" />
          </FormItem>
          <FormItem>
            <Field
              name={name(index, 'postCode')}
              as="input"
              placeholder="邮政编码"
            />
          </FormItem>
          <button type="button" onClick={() => insert(index + 1, {})}>
            +
          </button>
          <button type="button" onClick={() => remove(index)}>
            -
          </button>
          {index > 0 && (
            <button type="button" onClick={() => swap(index, index - 1)}>
              ⬆️
            </button>
          )}
          {index < items.length - 1 && (
            <button type="button" onClick={() => swap(index, index + 1)}>
              ⬇️
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={() => push({})}>
        +
      </button>
    </div>
  );
}

export default AddressForm;
