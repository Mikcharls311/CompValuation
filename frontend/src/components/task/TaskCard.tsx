import { Card, Tag, Space, Typography, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Task } from '../../types';

const { Text, Title } = Typography;

const statusColors: Record<Task['status'], string> = {
  todo: 'default',
  in_progress: 'processing',
  done: 'success',
};

const priorityColors: Record<Task['priority'], string> = {
  low: 'green',
  medium: 'orange',
  high: 'red',
};

const statusLabels: Record<Task['status'], string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card
      size="small"
      title={<Title level={5} style={{ margin: 0 }}>{task.title}</Title>}
      extra={
        <Space>
          {onEdit && (
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => onEdit(task)} />
          )}
          {onDelete && (
            <Button type="text" danger icon={<DeleteOutlined />} size="small" onClick={() => onDelete(task)} />
          )}
        </Space>
      }
      style={{ marginBottom: 12 }}
    >
      {task.description && <Text type="secondary">{task.description}</Text>}
      <div style={{ marginTop: 8 }}>
        <Tag color={statusColors[task.status]}>{statusLabels[task.status]}</Tag>
        <Tag color={priorityColors[task.priority]}>{task.priority}</Tag>
      </div>
    </Card>
  );
}
