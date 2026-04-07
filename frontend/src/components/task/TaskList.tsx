import { Table, Tag, Space, Button, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../../types';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

const statusColors: Record<Task['status'], string> = {
  todo: 'default',
  in_progress: 'processing',
  done: 'success',
};

const statusLabels: Record<Task['status'], string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const priorityColors: Record<Task['priority'], string> = {
  low: 'green',
  medium: 'orange',
  high: 'red',
};

interface TaskListProps {
  tasks: Task[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  loading?: boolean;
}

export default function TaskList({
  tasks,
  total,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  loading = false,
}: TaskListProps) {
  const navigate = useNavigate();

  const columns: ColumnsType<Task> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Task) => (
        <Button type="link" onClick={() => navigate(`/tasks/${record.id}`)} style={{ padding: 0 }}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Task['status']) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: Task['priority']) => (
        <Tag color={priorityColors[priority]}>{priority}</Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Task) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/tasks/${record.id}`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => onDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={tasks}
      loading={loading}
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: onPageChange,
        showTotal: (t) => `${t} tasks`,
      }}
    />
  );
}
