import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  text-align: center;
`;

const EmptyBox = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background-image: url('/box-icon.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  
  &:hover, &:focus {
    background-color: #e03b72;
    border-color: #e03b72;
  }
`;

function Dashboard() {
  return (
    <EmptyStateContainer>
      <EmptyBox />
      <EmptyText>未连接任何设备，请先在手机上打开相关服务，并属于其ip与端口号</EmptyText>
      <StyledButton type="primary">立即设置</StyledButton>
    </EmptyStateContainer>
  );
}

export default Dashboard;