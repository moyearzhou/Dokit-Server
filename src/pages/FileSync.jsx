import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Breadcrumb, Button, Space, Tooltip, message, Result } from 'antd';
import { 
  FolderOutlined, 
  FileOutlined, 
  ArrowUpOutlined, 
  ReloadOutlined, 
  UploadOutlined, 
  DownloadOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';
import { useServer } from '../context/ServerContext';

const FileSyncContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
`;

const PathContainer = styled.div`
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
`;

const StyledTable = styled(Table)`
  .ant-table-tbody > tr.folder-row:hover > td {
    background-color: rgba(255, 64, 129, 0.1);
  }
  
  .ant-table-tbody > tr.file-row:hover > td {
    background-color: rgba(255, 64, 129, 0.05);
  }
`;

const FileIcon = styled.span`
  margin-right: 8px;
  color: ${props => props.isFolder ? '#ffc107' : '#2196f3'};
`;

function FileSync() {
  const { serverConfig } = useServer();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState('/root/com.didichuxing.doraemondemo');
  const [error, setError] = useState(null);

  const fetchFileList = async (path) => {
    if (!serverConfig.ip || !serverConfig.port) {
      setError('请先配置服务器IP和端口');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://${serverConfig.ip}:${serverConfig.port}/getFileList?dirPath=${encodeURIComponent(path)}`);
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }
      const data = await response.json();
      setFileData(data.data);
      setCurrentPath(data.data.dirPath);
    } catch (error) {
      console.error('加载文件列表失败:', error);
      setError(error.message);
      message.error('加载文件列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFileList(currentPath);
  }, [serverConfig.ip, serverConfig.port]);

  const formatFileSize = (size) => {
    if (!size || size === '0.0B') return '0 B';
    return size;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(parseInt(timestamp));
    return format(date, 'yyyy/MM/dd HH:mm:ss');
  };

  const handlePathClick = (path) => {
    fetchFileList(path);
  };

  const handleRefresh = () => {
    fetchFileList(currentPath);
  };

  const handleParentDirectory = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    if (parentPath) {
      fetchFileList(parentPath);
    }
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text, record) => (
        <span>
          <FileIcon isFolder={record.fileType === 'folder'}>
            {record.fileType === 'folder' ? <FolderOutlined /> : <FileOutlined />}
          </FileIcon>
          {text}
        </span>
      ),
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 120,
      render: (text) => formatFileSize(text),
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
      width: 180,
      render: (text) => formatTimestamp(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {record.fileType === 'folder' ? (
            <Button 
              type="link" 
              size="small"
              onClick={() => fetchFileList(`${currentPath}/${record.fileName}`)}
            >
              打开
            </Button>
          ) : (
            <Button type="link" size="small">下载</Button>
          )}
        </Space>
      ),
    },
  ];

  const pathParts = currentPath.split('/').filter(Boolean);

  if (error) {
    return (
      <Result
        status="error"
        title="加载失败"
        subTitle={error}
        extra={[
          <Button key="retry" type="primary" onClick={() => fetchFileList(currentPath)}>
            重试
          </Button>
        ]}
      />
    );
  }

  return (
    <FileSyncContainer>
      <ToolbarContainer>
        <Space>
          <Tooltip title="上传">
            <Button icon={<UploadOutlined />} />
          </Tooltip>
          <Tooltip title="下载">
            <Button icon={<DownloadOutlined />} />
          </Tooltip>
          <Tooltip title="返回上级">
            <Button 
              icon={<ArrowUpOutlined />} 
              onClick={handleParentDirectory}
            />
          </Tooltip>
          <Tooltip title="刷新">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
            />
          </Tooltip>
        </Space>
      </ToolbarContainer>
      
      <PathContainer>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a onClick={() => handlePathClick('/root')}>根目录</a>
          </Breadcrumb.Item>
          {pathParts.map((part, index) => {
            const path = `/${pathParts.slice(0, index + 1).join('/')}`;
            return (
              <Breadcrumb.Item key={path}>
                <a onClick={() => handlePathClick(path)}>{part}</a>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      </PathContainer>
      
      <StyledTable
        columns={columns}
        dataSource={fileData?.fileList || []}
        rowKey="fileName"
        loading={loading}
        pagination={false}
        rowClassName={record => record.fileType === 'folder' ? 'folder-row' : 'file-row'}
      />
    </FileSyncContainer>
  );
}

export default FileSync;