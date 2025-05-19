import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  AppstoreOutlined, 
  FileTextOutlined, 
  SettingOutlined,
  BoxPlotOutlined
} from '@ant-design/icons';

const SidebarContainer = styled.aside`
  width: var(--sidebar-width);
  background-color: var(--sidebar-bg);
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #e8e8e8;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  border-bottom: 1px solid #e8e8e8;
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 6px;
`;

const MenuContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: rgba(255, 64, 129, 0.1);
  }
  
  &.active {
    background-color: rgba(255, 64, 129, 0.2);
    color: var(--primary-color);
    border-left: 3px solid var(--primary-color);
  }
  
  .anticon {
    margin-right: 10px;
  }
`;

const MenuLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  width: 100%;
`;

function Sidebar() {
  return (
    <SidebarContainer>
      <LogoContainer>
        <Logo>
          <BoxPlotOutlined style={{ fontSize: '24px' }} />
        </Logo>
      </LogoContainer>
      <MenuContainer>
        <MenuItem>
          <MenuLink to="/">
            <AppstoreOutlined />
            健康体检
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/dashboard">
            <SettingOutlined />
            一键全控
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/file-management">
            <FileTextOutlined />
            文件同步助手
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/product-management">
            <SettingOutlined />
            产品管理
          </MenuLink>
        </MenuItem>
      </MenuContainer>
    </SidebarContainer>
  );
}

export default Sidebar;