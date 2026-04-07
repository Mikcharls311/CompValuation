import { useState } from 'react';
import { Typography, Button, Space, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import TaskList from '../components/task/TaskList';
import TaskForm from '../components/task/TaskForm';
import TaskFilter from '../components/task/TaskFilter';
import ConfirmModal from '../components/common/ConfirmModal';
import ErrorAlert from '../components/common/ErrorAlert';
import type { Task, TaskCreateInput } from '../types';

const { Title } = Typography;

export default function TasksPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<Task['status'] | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | undefined>();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const { data, isLoading, error } = useTasks({
    page,
    status: statusFilter,
    priority: priorityFilter,
  });

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  if (error) return <ErrorAlert error={error} />;

  const handleCreate = async (values: TaskCreateInput) => {
    try {
      await createTask.mutateAsync(values);
      setCreateModalOpen(false);
      message.success('Task created!');
    } catch (e) {
      message.error('Failed to create task');
    }
  };

  const handleUpdate = async (values: TaskCreateInput) => {
    if (!editingTask) return;
    try {
      await updateTask.mutateAsync({ id: editingTask.id, data: values });
      setEditingTask(null);
      message.success('Task updated!');
    } catch (e) {
      message.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    try {
      await deleteTask.mutateAsync(deletingTask.id);
      setDeletingTask(null);
      message.success('Task deleted');
    } catch (e) {
      message.error('Failed to delete task');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Tasks</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
          New Task
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <TaskFilter
          status={statusFilter}
          priority={priorityFilter}
          onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
          onPriorityChange={(v) => { setPriorityFilter(v); setPage(1); }}
        />
      </div>

      <TaskList
        tasks={data?.items ?? []}
        total={data?.total ?? 0}
        page={page}
        pageSize={20}
        onPageChange={setPage}
        onEdit={setEditingTask}
        onDelete={setDeletingTask}
        loading={isLoading}
      />

      {/* Create Task Modal */}
      <Modal
        open={createModalOpen}
        title="Create New Task"
        footer={null}
        onCancel={() => setCreateModalOpen(false)}
        destroyOnClose
      >
        <TaskForm onSubmit={handleCreate} loading={createTask.isPending} />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        open={!!editingTask}
        title="Edit Task"
        footer={null}
        onCancel={() => setEditingTask(null)}
        destroyOnClose
      >
        {editingTask && (
          <TaskForm
            initialValues={editingTask}
            onSubmit={handleUpdate}
            loading={updateTask.isPending}
            submitLabel="Update Task"
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deletingTask}
        title="Delete Task"
        content={`Are you sure you want to delete "${deletingTask?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTask(null)}
        loading={deleteTask.isPending}
        danger
      />
    </div>
  );
}
