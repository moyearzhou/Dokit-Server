import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import { ServerProvider } from './context/ServerContext';
import './styles/global.css';

function App() {
  return (
    <ServerProvider>
      <Router>
        <MainLayout />
      </Router>
    </ServerProvider>
  );
}

export default App;
