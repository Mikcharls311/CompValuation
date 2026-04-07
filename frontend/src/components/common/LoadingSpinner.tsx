import { Spin } from 'antd';

export default function LoadingSpinner({ tip = 'Loading...' }: { tip?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
      <Spin size="large" tip={tip} />
    </div>
  );
}
