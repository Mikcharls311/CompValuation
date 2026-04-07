import { Form, Input, Select, Button } from 'antd';
import type { Task, TaskCreateInput } from '../../types';

interface TaskFormProps {
  initialValues?: Partial<TaskCreateInput>;
  onSubmit: (values: TaskCreateInput) => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function TaskForm({
  initialValues,
  onSubmit,
  loading = false,
  submitLabel = 'Save',
}: TaskFormProps) {
  const [form] = Form.useForm<TaskCreateInput>();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ status: 'todo', priority: 'medium', ...initialValues }}
      onFinish={onSubmit}
    >
      <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
        <Input placeholder="Enter task title" maxLength={255} />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea placeholder="Optional description" rows={3} maxLength={2000} />
      </Form.Item>

      <Form.Item name="status" label="Status" rules={[{ required: true }]}>
        <Select
          options={[
            { value: 'todo', label: 'To Do' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'done', label: 'Done' },
          ]}
        />
      </Form.Item>

      <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
        <Select
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {submitLabel}
        </Button>
      </Form.Item>
    </Form>
  );
}
