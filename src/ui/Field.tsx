/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useContext,
  useEffect,
  ChangeEvent,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { get } from 'lodash';
import FormItemContext from '../FormItemContext';
import FormStateContext from '../FormStateContext';
import createValidateFn from '../utils/createValidateFn';

interface Props extends FieldValidateProps {
  name: string;
  as?: React.ReactType;
  valueExtract?: (event: any) => any;
  asyncValidate?: (
    value: any,
    values: any,
  ) => Promise<string | undefined> | undefined;
  relyFieldsName?: string[];
  relyFn?: (values: any) => any;
  onChange?: (value: any) => any;
  compProps?: { [name: string]: any };
  children?: React.ReactNode;
  render?: (props: any) => React.ReactNode;
  defaultValue?: any;
}

interface InnerFieldProps extends Omit<Props, 'onChange'> {
  id: number;
  addField: (fieldName: string) => void;
  removeField: (fieldName: string) => void;
  onChange: (name: string, value: any) => void;
  value?: any;
  onBlur?: (fieldName: string) => void;
}

function useFieldConfigSync(props: Props) {
  const propsRef = useRef(props);
  const { addField, removeField } = useContext(FormStateContext);

  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  useEffect(() => {
    const { name } = props;
    addField({
      name,
      validate: createValidateFn(propsRef.current),
      asyncValidate: propsRef.current.asyncValidate,
      relyFieldsName: propsRef.current.relyFieldsName,
      relyFn: propsRef.current.relyFn,
    });

    return () => {
      removeField(name);
    };
  }, [addField, removeField, props]);
}

function InnerField(props: InnerFieldProps) {
  const {
    name,
    as,
    id,
    addField,
    removeField,
    onChange,
    value,
    compProps,
    children,
    render,
    defaultValue = '',
  } = props;

  useEffect(() => {
    addField(name);

    return () => {
      removeField(name);
    };
  }, [name, addField, removeField]);

  const renderField = useCallback(() => {
    const Comp: React.ReactNode = render
      ? render({ setFieldValue: onChange, id, name })
      : null;

    return Comp;
  }, [id, name, onChange, render]);

  const Comp = as;

  const renderComp = () => {
    if (render) {
      return renderField();
    }
    if (Comp) {
      return (
        <Comp
          data-testid="field"
          id={id}
          name={name}
          onChange={(event: ChangeEvent<any>) => {
            const compValue = props.valueExtract
              ? props.valueExtract(event)
              : event.target.value;
            onChange(name, compValue);
          }}
          value={value || defaultValue}
          onBlur={() => props.onBlur && props.onBlur(name)}
          {...compProps}
        >
          {children}
        </Comp>
      );
    }
    return null;
  };

  return <div className="sinoui-form-field">{renderComp()}</div>;
}

const MemoInnerField = React.memo(InnerField);

/**
 * 表单域
 */
function Field(props: Props) {
  const { id, addField, removeField } = useContext(FormItemContext);
  const { values, setValue, onBlur } = useContext(FormStateContext);
  const { name } = props;
  const value = useMemo(() => get(values, name), [name, values]);

  useFieldConfigSync(props);

  const onChange = useCallback(
    (fieldName, fieldValue) => {
      setValue(fieldName, fieldValue);

      if (props.onChange) {
        props.onChange(fieldValue);
      }
    },
    [props, setValue],
  );

  return (
    <MemoInnerField
      {...props}
      name={name}
      id={id}
      addField={addField}
      removeField={removeField}
      onChange={onChange}
      value={value}
      onBlur={onBlur}
    />
  );
}

export default Field;
