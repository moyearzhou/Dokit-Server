import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, Input, Button, Tag, Space, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

const Container = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SearchSection = styled.div`
  display: flex;
  gap: 16px;
`;

function DataMock() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/mockDataTemp.json');
      const result = await response.json();
      setData(result.datalist);
    } catch (error) {
      message.error('加载数据失败');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => console.log('查看详情', record)}>{text}</a>
      ),
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      render: (text) => (
        <Tag color={text === 'GET' ? 'green' : 'blue'}>{text}</Tag>
      ),
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '返回值类型',
      dataIndex: 'formatType',
      key: 'formatType',
      render: (text) => text.toUpperCase(),
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => (
        <Tag color="success">进行中</Tag>
      ),
    },
    {
      title: '创建人',
      key: 'owner',
      render: (_, record) => record.owner.name || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => console.log('编辑', record)}>编辑</a>
          <a onClick={() => console.log('复制', record)}>复制</a>
          <a onClick={() => console.log('删除', record)}>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <Header>
        <SearchSection>
          <Input
            placeholder="搜索接口名称或路径"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
        </SearchSection>
        <Button type="primary" icon={<PlusOutlined />}>
          新建接口
        </Button>
      </Header>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="_id"
        pagination={{
          total: data.length,
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </Container>
  );
}

export default DataMock;