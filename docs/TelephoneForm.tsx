/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { Field, FormItem, useFieldArray } from '../src';

const types = ['家庭', '工作', 'iPhone', '手机', '主要', '工作传真', '其他'];

function TelephoneForm() {
  const {
    getFieldName: name,
    items,
    insert,
    remove,
    push,
    swap,
  } = useFieldArray('telephones');

  const handlePush = () => {
    if (items.length < types.length) {
      const idx = types.findIndex(
        (type) => items.findIndex((item: any) => item.type === type) === -1,
      );
      if (idx !== -1) {
        push({ type: types[idx] });
      }
    } else {
      push({ type: '其他' });
    }
  };

  const handleInsert = (index: number) => {
    if (items.length < types.length) {
      const idx = types.findIndex(
        (type) => items.findIndex((item: any) => item.type === type) === -1,
      );
      if (idx !== -1) {
        insert(index + 1, { type: types[idx] });
      }
    } else {
      insert(index + 1, { type: '其他' });
    }
  };

  return (
    <div style={{ paddingTop: 16, paddingBottom: 16 }}>
      <label> 添加电话</label>
      {items.map((_telephone, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
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
              name={name(index, 'type')}
              as="input"
              required
              placeholder="类型"
            />
          </FormItem>
          <FormItem>
            <Field
              name={name(index, 'telephone')}
              as="input"
              required
              maxlength={11}
              minlength={4}
              placeholder="电话"
            />
          </FormItem>
          <button type="button" onClick={() => handleInsert(index)}>
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
      <button type="button" onClick={() => handlePush()}>
        +
      </button>
    </div>
  );
}

export default TelephoneForm;
