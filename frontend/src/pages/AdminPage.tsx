import { useState } from 'react';
import { Typography, Button, Modal, message, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useUsers, useCreateUser, useDeleteUser } from '../hooks/useUsers';
import UserTable from '../components/user/UserTable';
import UserForm from '../components/user/UserForm';
import ConfirmModal from '../components/common/ConfirmModal';
import ErrorAlert from '../components/common/ErrorAlert';
import { useAuthStore } from '../store/auth.store';
import type { User, UserCreateInput } from '../types';

const { Title } = Typography;

export default function AdminPage() {
  const { user: currentUser } = useAuthStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  if (error) return <ErrorAlert error={error} />;

  const handleCreate = async (values: UserCreateInput) => {
    try {
      await createUser.mutateAsync(values);
      setCreateOpen(false);
      message.success('User created!');
    } catch (e) {
      message.error('Failed to create user');
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser.mutateAsync(deletingUser.id);
      setDeletingUser(null);
      message.success('User deleted');
    } catch {
      message.error('Failed to delete user');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>User Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
          New User
        </Button>
      </div>

      <Card>
        <UserTable
          users={users ?? []}
          onEdit={() => {}}
          onDelete={setDeletingUser}
          loading={isLoading}
          currentUserId={currentUser?.id}
        />
      </Card>

      <Modal open={createOpen} title="Create User" footer={null} onCancel={() => setCreateOpen(false)} destroyOnClose>
        <UserForm onSubmit={handleCreate} loading={createUser.isPending} />
      </Modal>

      <ConfirmModal
        open={!!deletingUser}
        title="Delete User"
        content={`Delete user "${deletingUser?.full_name}"? This is permanent.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingUser(null)}
        loading={deleteUser.isPending}
        danger
      />
    </div>
  );
}
