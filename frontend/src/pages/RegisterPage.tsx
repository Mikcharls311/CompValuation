import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { AxiosError } from 'axios';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string; full_name: string; confirm: string }) => {
    setError(null);
    setLoading(true);
    try {
      await authService.register(values.email, values.password, values.full_name);
      navigate('/login', { state: { message: 'Account created! Please sign in.' } });
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || 'Registration failed.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <Space direction="vertical" style={{ width: '100%', textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>Create Account</Title>
          <Text type="secondary">Join CompValuation today</Text>
        </Space>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={onFinish} size="large">
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

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject('Passwords do not match');
                },
              }),
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Text>
          Already have an account? <Link to="/login">Sign in</Link>
        </Text>
      </Card>
    </div>
  );
}
