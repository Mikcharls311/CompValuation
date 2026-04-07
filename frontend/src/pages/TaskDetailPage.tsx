import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Tag, Button, Space, Descriptions, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import TaskForm from '../components/task/TaskForm';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import type { TaskCreateInput } from '../types';

const { Title } = Typography;

const statusColors = { todo: 'default', in_progress: 'processing', done: 'success' } as const;
const statusLabels = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' } as const;
const priorityColors = { low: 'green', medium: 'orange', high: 'red' } as const;

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: task, isLoading, error } = useTask(id!);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;
  if (!task) return null;

  const handleUpdate = async (values: TaskCreateInput) => {
    try {
      await updateTask.mutateAsync({ id: task.id, data: values });
      setEditOpen(false);
      message.success('Task updated!');
    } catch {
      message.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync(task.id);
      message.success('Task deleted');
      navigate('/tasks');
    } catch {
      message.error('Failed to delete task');
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tasks')}>
          Back to Tasks
        </Button>
      </Space>

      <Card
        title={<Title level={3} style={{ margin: 0 }}>{task.title}</Title>}
        extra={
          <Space>
            <Button icon={<EditOutlined />} onClick={() => setEditOpen(true)}>Edit</Button>
            <Button icon={<DeleteOutlined />} danger onClick={() => setDeleteOpen(true)}>Delete</Button>
          </Space>
        }
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Status">
            <Tag color={statusColors[task.status]}>{statusLabels[task.status]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            <Tag color={priorityColors[task.priority]}>{task.priority}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            {new Date(task.created_at).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated">
            {new Date(task.updated_at).toLocaleString()}
          </Descriptions.Item>
          {task.description && (
            <Descriptions.Item label="Description" span={2}>
              {task.description}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Modal open={editOpen} title="Edit Task" footer={null} onCancel={() => setEditOpen(false)} destroyOnClose>
        <TaskForm
          initialValues={task}
          onSubmit={handleUpdate}
          loading={updateTask.isPending}
          submitLabel="Update Task"
        />
      </Modal>

      <ConfirmModal
        open={deleteOpen}
        title="Delete Task"
        content={`Delete "${task.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleteTask.isPending}
        danger
      />
    </div>
  );
}
