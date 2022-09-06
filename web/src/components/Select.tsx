import { Select as AntdSelect } from 'antd';
import { noop } from 'lodash';
import React, { ChangeEventHandler, CSSProperties, useState } from 'react';
import { useDevice } from '../ctx/device';
import { useMemoCmp } from '../hooks/useMemoCmp';

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
};

const getOptionKey = (option: SelectOption): string => {
  return `${option.label}-${option.value}`;
};

export const Select: React.FC<SelectProps> = (props) => {
  const options = useMemoCmp(props.options);
  const defaultValue = props.defaultValue;
  const onChange = props.onChange || noop;
  const style = props.style;

  const device = useDevice();

  const [value, setValue] = useState(() => {
    if (typeof defaultValue === 'string') {
      return defaultValue;
    }
    if (options.length > 0) {
      return options[0].value;
    }
    return '';
  });

  const onNativeSelectChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const value = event.target.value;
    setValue(value);
    onChange(value);
  };

  const onAntdSelectChange = (value: string) => {
    setValue(value);
    onChange(value);
  };

  // The Ant Design select component has been freezing on mobile devices. We use the native select in this case.
  if (device.mobile || device.tablet) {
    return (
      <select value={value} defaultValue={defaultValue} onChange={onNativeSelectChange} style={style}>
        {options.map((option) => (
          <option key={getOptionKey(option)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else {
    return (
      <AntdSelect
        value={value}
        defaultValue={defaultValue}
        options={options}
        onChange={onAntdSelectChange}
        style={style}
        size="large"
      />
    );
  }
};
