import { Table, Tag, Space, Button, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { User } from '../../types';
import type { ColumnsType } from 'antd/es/table';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  loading?: boolean;
  currentUserId?: string;
}

export default function UserTable({ users, onEdit, onDelete, loading, currentUserId }: UserTableProps) {
  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: User['role']) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'}>{role}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'}>{active ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: User) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => onDelete(record)}
            disabled={record.id === currentUserId}
          />
        </Space>
      ),
    },
  ];

  return <Table rowKey="id" columns={columns} dataSource={users} loading={loading} pagination={{ pageSize: 20 }} />;
}
