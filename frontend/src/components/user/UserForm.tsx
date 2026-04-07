import { Form, Input, Button } from 'antd';
import type { UserCreateInput } from '../../types';

interface UserFormProps {
  onSubmit: (values: UserCreateInput) => void;
  loading?: boolean;
}

export default function UserForm({ onSubmit, loading = false }: UserFormProps) {
  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <Form.Item
        name="full_name"
        label="Full Name"
        rules={[{ required: true, message: 'Full name is required' }]}
      >
        <Input placeholder="Jane Doe" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Enter a valid email' },
        ]}
      >
        <Input placeholder="jane@example.com" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Password is required' },
          { min: 8, message: 'Minimum 8 characters' },
        ]}
      >
        <Input.Password placeholder="••••••••" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Create User
        </Button>
      </Form.Item>
    </Form>
  );
}
