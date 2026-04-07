import { Row, Col, Card, Statistic, Typography, List, Tag, Spin } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useStats } from '../hooks/useStats';
import { useTasks } from '../hooks/useTasks';
import ErrorAlert from '../components/common/ErrorAlert';
import { useAuthStore } from '../store/auth.store';

const { Title, Text } = Typography;

const statusLabels: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const statusColors: Record<string, string> = {
  todo: 'default',
  in_progress: 'processing',
  done: 'success',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: stats, isLoading: statsLoading, error: statsError } = useStats();
  const { data: recentTasks, isLoading: tasksLoading } = useTasks({ page: 1 });

  if (statsError) return <ErrorAlert error={statsError} />;

  return (
    <div>
      <Title level={3}>Welcome back, {user?.full_name?.split(' ')[0] || 'User'}</Title>

      {statsLoading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Tasks"
                value={stats?.total ?? 0}
                prefix={<UnorderedListOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="To Do"
                value={stats?.by_status.todo ?? 0}
                prefix={<ClockCircleOutlined style={{ color: '#8c8c8c' }} />}
                valueStyle={{ color: '#8c8c8c' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="In Progress"
                value={stats?.by_status.in_progress ?? 0}
                prefix={<ExclamationCircleOutlined style={{ color: '#1677ff' }} />}
                valueStyle={{ color: '#1677ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Done"
                value={stats?.by_status.done ?? 0}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card title="Recent Tasks" loading={tasksLoading}>
        <List
          dataSource={recentTasks?.items.slice(0, 5) ?? []}
          locale={{ emptyText: 'No tasks yet. Create your first task!' }}
          renderItem={(task) => (
            <List.Item
              extra={<Tag color={statusColors[task.status]}>{statusLabels[task.status]}</Tag>}
            >
              <List.Item.Meta
                title={task.title}
                description={<Text type="secondary">{task.description || 'No description'}</Text>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
