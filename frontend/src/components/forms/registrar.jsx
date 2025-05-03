import React from 'react';
import { Form, Input, Button, Select, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

export function FormularioRegistro() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Valores del formulario:', values);
    message.success('Formulario enviado exitosamente');
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Form.Item
        name="nombre"
        label="Nombre"
        rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="descripcion"
        label="Descripción"
        rules={[{ required: true, message: 'Por favor ingrese la descripción' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="categoria"
        label="Categoría"
        rules={[{ required: true, message: 'Por favor seleccione una categoría' }]}
      >
        <Select placeholder="Seleccione una categoría">
          <Option value="categoria1">Categoría 1</Option>
          <Option value="categoria2">Categoría 2</Option>
          <Option value="categoria3">Categoría 3</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="contenido"
        label="Contenido"
        rules={[{ required: true, message: 'Por favor ingrese el contenido' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="fechaCaducidad"
        label="Fecha de caducidad"
        rules={[{ required: true, message: 'Por favor seleccione la fecha' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="imagen"
        label="Imagen"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="Suba una imagen"
      >
        <Upload name="imagen" listType="picture" beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Registrar
        </Button>
      </Form.Item>
    </Form>
  );
};
