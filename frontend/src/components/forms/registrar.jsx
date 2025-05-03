import React from 'react';
import { Form, Input, Button, Select, DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
const { TextArea } = Input;
const { Option } = Select;

export function FormularioRegistro({ id = 0, producto = null }) {
  const [form] = Form.useForm();


  useEffect(() => {
    if (producto) {
      console.log(producto)
      // Convertimos fecha_caducidad a objeto dayjs para que DatePicker lo entienda
      form.setFieldsValue({
        ...producto,
        fecha_caducidad: producto.fecha_caducidad ? dayjs(producto.fecha_caducidad) : null,
      });
    }
  }, [producto, form]);


  const onFinish = async (values) => {
    let url = id != 0 ? '/editar/' + id : '/crear'
    const res = await axios.post('http://localhost:3000/producto' + url, {
      nombre: values.nombre,
      cantidad: 0, // valor por defecto si no viene en el form
      fecha_caducidad: values.fechaCaducidad, // convertir a YYYY-MM-DD
      categoria: values.categoria,
      temperatura_optima: null, // o asigna desde values si está en el formulario
      lote: '', // o values.lote
      proveedor: '', // o values.proveedor
    });

    if (res.status == 200) {
      alert("Producto Creado")
    } else {
      alert("Error al crear el producto")
    }
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
          <Option value="alimento">Alimento</Option>
          <Option value="medicamento">Medicamento</Option>
          <Option value="laboratorio">Laboratorio</Option>
          <Option value="otro">Otro</Option>
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
