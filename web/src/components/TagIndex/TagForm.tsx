import { Button, Form, Input, Popconfirm, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { TagCategory } from '../../graphql';

type Tag = {
  id: string;
  name: string;
  category: TagCategory;
};

type Props = {
  tag: Tag;
  onCommit: () => void;
};

export const TagForm: React.FC<Props> = (props) => {
  const [form] = useForm();

  // tag
  const tag = props.tag;

  return (
    <Form form={form} layout="inline">
      <Form.Item name="name">
        <Input defaultValue={tag.name} value={tag.name} />
      </Form.Item>

      <Form.Item name="category">
        <Select defaultValue={tag.category} value={tag.category}>
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
