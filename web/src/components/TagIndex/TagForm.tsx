import { Button, Form, Input, Popconfirm, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';
import { TagCategory } from '../../graphql';
import { Nullable } from '../../util/types';

type Tag = {
  id: string;
  name: string;
  category: TagCategory;
};

type Props = {
  tag: Tag;
};

export const TagForm: React.FC<Props> = (props) => {
  const [form] = useForm();

  // tag
  const initialTag = props.tag;
  const [updatedTag, setUpdatedTag] = useState<Nullable<Tag>>(null);
  const tag = updatedTag || initialTag;

  return (
    <Form form={form} layout="inline">
      <Form.Item name="name">
        <Input defaultValue={initialTag.name} value={tag.name} />
      </Form.Item>

      <Form.Item name="category">
        <Select defaultValue={initialTag.category} value={tag.category}>
          <Select.Option value={TagCategory.DIFFICULTY}>difficulty</Select.Option>
          <Select.Option value={TagCategory.GENRE}>genre</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          save
        </Button>
      </Form.Item>

      {tag.id && (
        <Form.Item>
          <Popconfirm title="are you sure?" okText="ok" cancelText="cancel">
            <Button>delete</Button>
          </Popconfirm>
        </Form.Item>
      )}
    </Form>
  );
};
