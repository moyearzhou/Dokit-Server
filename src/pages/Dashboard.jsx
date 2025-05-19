import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import ConfigDialog from '../components/ConfigDialog/ConfigDialog';
import { useServer } from '../context/ServerContext';

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
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const { serverConfig } = useServer();

  const handleOpenDialog = () => {
    setIsConfigDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsConfigDialogOpen(false);
  };

  return (
    <EmptyStateContainer>
      <EmptyBox />
      <EmptyText>
        {serverConfig.ip
          ? `当前连接：${serverConfig.ip}:${serverConfig.port}`
          : '未连接任何设备，请先在手机上打开相关服务，并设置其IP与端口号'}
      </EmptyText>
      <StyledButton type="primary" onClick={handleOpenDialog}>
        {serverConfig.ip ? '修改设置' : '立即设置'}
      </StyledButton>
      <ConfigDialog
        open={isConfigDialogOpen}
        onClose={handleCloseDialog}
      />
    </EmptyStateContainer>
  );
}

export default Dashboard;