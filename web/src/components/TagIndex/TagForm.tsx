import { Button, Form, Input, message, Popconfirm, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useMemo, useState } from 'react';
import { TagCategory } from '../../graphql';
import { useDeleteTag } from './useDeleteTag';
import { useTagUpserter } from './useTagUpserter';

type Tag = {
  id?: string;
  name: string;
  category: TagCategory;
};

type Props = {
  tag: Tag;
  onCommit: () => void;
};

export const TagForm: React.FC<Props> = (props) => {
  const tag = props.tag;
  const onCommit = props.onCommit;

  const [form] = useForm();
  const [dirty, setDirty] = useState(false);
  const initialValues = useMemo(
    () => ({
      name: tag.name,
      category: tag.category,
    }),
    [tag]
  );
  const onErrors = (errors: string[]) => {
    console.error(errors);
    message.error('something went wrong');
  };
  const onValuesChange = (_: any, values: any) => {
    const nextDirty = Object.entries(initialValues).some(([key, val]) => values[key] !== val);
    setDirty(nextDirty);
  };
  useEffect(() => {
    const nextDirty = Object.entries(initialValues).some(([key, val]) => tag[key as keyof Tag] !== val);
    setDirty(nextDirty);
  }, [initialValues, tag]);
  const [upsertTag, upserting] = useTagUpserter(() => {
    message.success('tag saved');
    onCommit();
    if (!tag.id) {
      form.resetFields();
    }
  }, onErrors);
  const [deleteTag, deleting] = useDeleteTag(() => {
    message.success(`tag deleted: '${tag.name}'`);
    onCommit();
  }, onErrors);
  const loading = upserting || deleting;

  const onSave = () => {
    const name = form.getFieldValue('name');
    const category = form.getFieldValue('category');
    upsertTag({ id: tag.id, category, name });
  };

  return (
    <Form form={form} layout="inline" initialValues={initialValues} onValuesChange={onValuesChange}>
      <Form.Item name="name">
        <Input />
      </Form.Item>

      <Form.Item name="category">
        <Select>
          <Select.Option value={TagCategory.DIFFICULTY}>difficulty</Select.Option>
          <Select.Option value={TagCategory.GENRE}>genre</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={!dirty || loading} onClick={onSave}>
          save
        </Button>
      </Form.Item>

      {tag.id && (
        <Form.Item>
          <Popconfirm
            title="are you sure?"
            okText="ok"
            cancelText="cancel"
            disabled={loading}
            onConfirm={() => deleteTag(tag.id!)}
          >
            <Button>delete</Button>
          </Popconfirm>
        </Form.Item>
      )}
    </Form>
  );
};
