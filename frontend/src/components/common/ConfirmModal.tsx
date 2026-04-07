import { Modal } from 'antd';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}

export default function ConfirmModal({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      okButtonProps={{ danger, loading }}
      okText="Confirm"
      cancelText="Cancel"
    >
      <p>{content}</p>
    </Modal>
  );
}
