import { Alert } from 'antd';
import { AxiosError } from 'axios';

interface ErrorAlertProps {
  error: unknown;
  message?: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) return detail.map((d: { msg: string }) => d.msg).join(', ');
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

export default function ErrorAlert({ error, message }: ErrorAlertProps) {
  return (
    <Alert
      type="error"
      showIcon
      message={message || 'Error'}
      description={getErrorMessage(error)}
      style={{ marginBottom: 16 }}
    />
  );
}
