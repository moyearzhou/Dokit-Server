import React from 'react';
import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const NavMenu = styled.div`
  display: flex;
  gap: 20px;
`;

const NavItem = styled.div`
  cursor: pointer;
  padding: 0 10px;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  .anticon {
    font-size: 20px;
  }
`;

function Header() {
  const navigate = useNavigate();
  return (
    <HeaderContainer>
      <Logo>CodemaoKit</Logo>
      <RightSection>
        <NavMenu>
          <NavItem onClick={() => navigate('/dashboard')}>首页</NavItem>
          {/* <NavItem>产品中心</NavItem>
          <NavItem>控制台</NavItem> */}
          {/* <NavItem>运维管理</NavItem> */}
        </NavMenu>
        <UserProfile>
          <UserOutlined />
        </UserProfile>
      </RightSection>
    </HeaderContainer>
  );
}

export default Header;