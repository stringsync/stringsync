import { Button, Form, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { UserRole } from '../../graphql';
import { User } from './useUsers';

type Props = {
  user: User;
};

export const UserForm: React.FC<Props> = (props) => {
  // props
  const { user } = props;

  // form
  const [form] = useForm();
  const [dirty, setDirty] = useState(false);
  const initialValues = {
    role: user.role,
  };
  const onValuesChange = (_: any, values: any) => {
    const nextDirty = Object.entries(initialValues).some(([key, val]) => values[key] !== val);
    setDirty(nextDirty);
  };

  return (
    <Form form={form} layout="inline" initialValues={initialValues} onValuesChange={onValuesChange}>
      <Form.Item name="role">
        <Select>
          <Select.Option value={UserRole.ADMIN}>admin</Select.Option>
          <Select.Option value={UserRole.TEACHER}>teacher</Select.Option>
          <Select.Option value={UserRole.STUDENT}>student</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button disabled={!dirty} type="primary" htmlType="submit">
          save
        </Button>
      </Form.Item>
    </Form>
  );
};
