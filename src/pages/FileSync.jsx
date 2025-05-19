import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Breadcrumb, Button, Space, Tooltip } from 'antd';
import { 
  FolderOutlined, 
  FileOutlined, 
  ArrowUpOutlined, 
  ReloadOutlined, 
  UploadOutlined, 
  DownloadOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';

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
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // 模拟从API获取数据
    fetch('/filelist.json')
      .then(response => response.json())
      .then(data => {
        setFileData(data.data);
        setCurrentPath(data.data.dirPath);
        setLoading(false);
      })
      .catch(error => {
        console.error('加载文件列表失败:', error);
        setLoading(false);
      });
  }, []);

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
    // 在实际应用中，这里应该请求新路径的数据
    console.log('导航到路径:', path);
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
            <Button type="link" size="small">打开</Button>
          ) : (
            <Button type="link" size="small">下载</Button>
          )}
        </Space>
      ),
    },
  ];

  const pathParts = currentPath.split('/').filter(Boolean);

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
            <Button icon={<ArrowUpOutlined />} />
          </Tooltip>
          <Tooltip title="刷新">
            <Button icon={<ReloadOutlined />} />
          </Tooltip>
        </Space>
      </ToolbarContainer>
      
      <PathContainer>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a onClick={() => handlePathClick('/')}>根目录</a>
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