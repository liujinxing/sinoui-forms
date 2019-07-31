/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useCallback, useRef, useEffect } from 'react';
import { Field, FormItem, useFieldArray } from '../src';

const types = ['家庭', '工作', 'iPhone', '手机', '主要', '工作传真', '其他'];

function FormInner(props: any) {
  const { name, index, handleInsert, remove, swap, itemsLength } = props;
  return (
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
      {index < itemsLength - 1 && (
        <button type="button" onClick={() => swap(index, index + 1)}>
          ⬇️
        </button>
      )}
    </div>
  );
}

const Item = React.memo(FormInner);

function TelephoneForm(props: { parentName?: string }) {
  const { parentName } = props;

  const {
    getFieldName: name,
    items,
    insert,
    remove,
    push,
    swap,
  } = useFieldArray(parentName ? `${parentName}.telephones` : 'telephones');
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

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

  const handleInsert = useCallback(
    (index: number) => {
      if (itemsRef.current.length < types.length) {
        const idx = types.findIndex(
          (type) =>
            itemsRef.current.findIndex((item: any) => item.type === type) ===
            -1,
        );
        if (idx !== -1) {
          insert(index + 1, { type: types[idx] });
        }
      } else {
        insert(index + 1, { type: '其他' });
      }
    },
    [insert],
  );

  return (
    <div style={{ paddingTop: 4, paddingBottom: 4 }}>
      <label> 添加电话</label>
      {items.map((_telephone, index) => (
        <Item
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          index={index}
          itemsLength={items.length}
          name={name}
          remove={remove}
          swap={swap}
          handleInsert={handleInsert}
        />
      ))}
      <button type="button" onClick={() => handlePush()}>
        +
      </button>
    </div>
  );
}

export default TelephoneForm;
