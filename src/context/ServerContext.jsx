import React, { createContext, useContext, useState } from 'react';

const ServerContext = createContext();

export function useServer() {
  return useContext(ServerContext);
}

export function ServerProvider({ children }) {
  const [serverConfig, setServerConfig] = useState(() => {
    const savedConfig = localStorage.getItem('serverConfig');
    return savedConfig ? JSON.parse(savedConfig) : {
      ip: '',
      port: ''
    };
  });

  const updateServerConfig = (ip, port) => {
    const newConfig = { ip, port };
    setServerConfig(newConfig);
    localStorage.setItem('serverConfig', JSON.stringify(newConfig));
  };

  return (
    <ServerContext.Provider value={{ serverConfig, updateServerConfig }}>
      {children}
    </ServerContext.Provider>
  );
}