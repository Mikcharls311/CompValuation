import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  CheckSquareOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useUIStore } from '../../store/ui.store';

const { Sider } = Layout;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/tasks', icon: <CheckSquareOutlined />, label: 'Tasks' },
    ...(user?.role === 'admin'
      ? [{ key: '/admin', icon: <TeamOutlined />, label: 'Users' }]
      : []),
  ];

  return (
    <Sider
      collapsed={!sidebarOpen}
      collapsedWidth={60}
      width={220}
      style={{ height: '100vh', position: 'sticky', top: 0 }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: sidebarOpen ? 16 : 12,
          color: '#fff',
          padding: '0 8px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {sidebarOpen ? 'CompValuation' : 'CV'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
}
