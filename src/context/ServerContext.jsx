import React, { createContext, useContext, useState } from 'react';

const ServerContext = createContext();

export function useServer() {
  return useContext(ServerContext);
}

export function ServerProvider({ children }) {
  const [serverConfig, setServerConfig] = useState({
    ip: '',
    port: ''
  });

  const updateServerConfig = (ip, port) => {
    setServerConfig({ ip, port });
  };

  return (
    <ServerContext.Provider value={{ serverConfig, updateServerConfig }}>
      {children}
    </ServerContext.Provider>
  );
}