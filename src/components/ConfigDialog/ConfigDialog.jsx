import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useServer } from '../../context/ServerContext';

const ConfigDialog = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const { updateServerConfig } = useServer();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      updateServerConfig(values.ip, values.port);
      message.success('配置已保存');
      onClose();
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="服务器配置"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="确认"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        name="serverConfig"
      >
        <Form.Item
          name="ip"
          label="服务器IP地址"
          rules={[
            { required: true, message: '请输入服务器IP地址' },
            { pattern: /^(?:\d{1,3}\.){3}\d{1,3}$/, message: '请输入有效的IP地址' }
          ]}
        >
          <Input placeholder="例如：192.168.1.100" />
        </Form.Item>

        <Form.Item
          name="port"
          label="端口号"
          rules={[
            { required: true, message: '请输入端口号' },
            { pattern: /^\d+$/, message: '端口号必须是数字' },
            { validator: (_, value) => {
                const port = parseInt(value);
                if (port >= 0 && port <= 65535) {
                  return Promise.resolve();
                }
                return Promise.reject('端口号必须在0-65535之间');
              }
            }
          ]}
        >
          <Input placeholder="例如：8080" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ConfigDialog;