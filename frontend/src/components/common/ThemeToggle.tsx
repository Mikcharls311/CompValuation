import { Button, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useUIStore } from '../../store/ui.store';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();
  return (
    <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      <Button
        type="text"
        icon={theme === 'light' ? <BulbOutlined /> : <BulbFilled />}
        onClick={toggleTheme}
      />
    </Tooltip>
  );
}
