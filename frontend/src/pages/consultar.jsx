import React, { useState } from 'react';
import { Card, Input, List, Button, Drawer, Typography, Badge, Select, Divider } from 'antd';
import { ShoppingOutlined, EyeOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { FaPen } from 'react-icons/fa6';
const { Option } = Select;
const { Title, Text } = Typography


// DUMMY DATA XD s

const productosOriginales = [
  { id: 1, nombre: "Coca-Cola Lata", stock: 10, dias_vencimiento: 30 },
  { id: 2, nombre: "Pepsi Botella", stock: 5, dias_vencimiento: 20 },
  { id: 3, nombre: "Fanta", stock: 3, dias_vencimiento: 25 },
  { id: 4, nombre: "Sprite", stock: 8, dias_vencimiento: 15 },
];

export function ConsultaProductos() {

  const [filtro, setFiltro] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Stock
  const getColorStock = (stock) => {
    if (stock < 5) return 'red';
    if (stock < 8) return 'orange';
    return 'green';
  };

  
  const productosFiltrados = productosOriginales
    .filter(p =>
      p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      p.id.toString().includes(filtro)
    )

  const mostrarDetalles = (producto) => {
    setProductoSeleccionado(producto);
    setDrawerVisible(true);
  };

  return (
    <Card  style={{ textAlign: 'center'}} title={<Title level={4}>  Consulta de Productos</Title>}>
      <Input
        placeholder="Buscar Producto por nombre o ID"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        style={{ marginBottom: 8 }}
      />

      <Divider />

      <List
        bordered
        dataSource={productosFiltrados}
        style={{ flex: 1, overflowY: 'auto', marginBottom: 8 }}
        renderItem={(item, index) => (
          <List.Item
            style={{
              backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
              borderLeft: `4px solid ${getColorStock(item.stock)}`,
            }}
            actions={[
              <Button type="link" icon={<EyeOutlined />} onClick={() => mostrarDetalles(item)}>
                Ver
              </Button>
              ,
              <Button  href={`editar-producto/${item.id}`} type="link" icon={<FaPen />}>
                Editar
              </Button>
            ]}
          >
            <Badge
              count={item.stock}
              style={{ backgroundColor: getColorStock(item.stock), marginRight: 8 }}
            />
            <Text>{item.nombre}</Text>
          </List.Item>
        )}
      />

      <Drawer
        title={`🛒 Detalle del Producto`}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {productoSeleccionado && (
          <>
            <p><Text strong>ID:</Text> {productoSeleccionado.id}</p>
            <p><Text strong>Nombre:</Text> {productoSeleccionado.nombre}</p>
            <p><Text strong>Stock:</Text> {productoSeleccionado.stock}</p>
            <p><Text strong>Días para vencer:</Text> {productoSeleccionado.dias_vencimiento}</p>
          </>
        )}
      </Drawer>
    </Card>
  );
};