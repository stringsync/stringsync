import { Button, Form, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { UserRole } from '../../graphql';
import { notify } from '../../lib/notify';
import { Nullable } from '../../util/types';
import { toUserRole } from './helpers';
import { UserPreview } from './types';
import { useUserUpdater } from './useUserUpdater';

type Props = {
  user: UserPreview;
};

export const UserForm: React.FC<Props> = (props) => {
  const [form] = useForm();

  // user
  const initialUser = props.user;
  const [updatedUser, setUpdatedUser] = useState<Nullable<UserPreview>>(null);
  const user = updatedUser || initialUser;
  const [isUpdating, updateUser] = useUserUpdater(
    (user) => {
      notify.message.success({ content: `saved ${user.username}` });
      setUpdatedUser(user);
      setDirty(false);
    },
    () => {
      notify.message.error({ content: `something went wrong ${user.username}` });
    }
  );
  const onSave = () => {
    const role = toUserRole(form.getFieldValue('role'));
    updateUser({ input: { id: user.id, role } });
  };

  // form
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
        <Button loading={isUpdating} disabled={!dirty || isUpdating} type="primary" htmlType="submit" onClick={onSave}>
          save
        </Button>
      </Form.Item>
    </Form>
  );
};
