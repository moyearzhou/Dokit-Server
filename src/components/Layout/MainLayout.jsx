import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Dashboard from '../../pages/Dashboard';
import FileSync from '../../pages/FileSync';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f0f2f5;
`;

function MainLayout() {
  return (
    <LayoutContainer>
      <Header />
      <ContentWrapper>
        <Sidebar />
        <MainContent>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/file-sync" element={<FileSync />} />
          </Routes>
        </MainContent>
      </ContentWrapper>
    </LayoutContainer>
  );
}

export default MainLayout;