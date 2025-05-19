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
      if (data.code !== 200) {
        throw new Error(data.message || '获取文件列表失败');
      }
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
    message.success('刷新成功');
  };

  const handleParentDirectory = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    if (parentPath) {
      fetchFileList(parentPath);
    } else {
      message.warning('已经是根目录');
    }
  };

  const handleFolderClick = (path) => {
    fetchFileList(`${currentPath}/${path}`);
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text, record) => (
        <span style={{ cursor: record.fileType === 'folder' ? 'pointer' : 'default' }}
              onClick={() => record.fileType === 'folder' && handleFolderClick(text)}>
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
              onClick={() => handleFolderClick(record.fileName)}
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
            <a onClick={() => handlePathClick('/root')}>root</a>
          </Breadcrumb.Item>
          {pathParts.slice(1).map((part, index) => (
            <Breadcrumb.Item key={index}>
              <a onClick={() => handlePathClick(`/root/${pathParts.slice(1, index + 2).join('/')}`)}
              >
                {part}
              </a>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </PathContainer>

      <StyledTable
        columns={columns}
        dataSource={fileData?.fileList || []}
        rowKey="fileName"
        loading={loading}
        rowClassName={record => record.fileType === 'folder' ? 'folder-row' : 'file-row'}
        pagination={false}
      />
    </FileSyncContainer>
  );
}

export default FileSync;