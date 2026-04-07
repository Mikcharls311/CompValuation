import { Layout, Button, Space, Typography, Avatar, Dropdown } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../store/ui.store';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header() {
  const { user, logout } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ];

  return (
    <AntHeader
      style={{
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'inherit',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <Button
        type="text"
        icon={sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        onClick={toggleSidebar}
        style={{ fontSize: 16 }}
      />

      <Space>
        <ThemeToggle />
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} size="small" />
            <Text>{user?.full_name || user?.email}</Text>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
