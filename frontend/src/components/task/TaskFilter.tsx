import { Select, Space } from 'antd';
import type { Task } from '../../types';

interface TaskFilterProps {
  status?: Task['status'];
  priority?: Task['priority'];
  onStatusChange: (v: Task['status'] | undefined) => void;
  onPriorityChange: (v: Task['priority'] | undefined) => void;
}

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function TaskFilter({ status, priority, onStatusChange, onPriorityChange }: TaskFilterProps) {
  return (
    <Space wrap>
      <Select
        allowClear
        placeholder="Filter by status"
        style={{ width: 180 }}
        value={status}
        options={statusOptions}
        onChange={onStatusChange}
      />
      <Select
        allowClear
        placeholder="Filter by priority"
        style={{ width: 180 }}
        value={priority}
        options={priorityOptions}
        onChange={onPriorityChange}
      />
    </Space>
  );
}
