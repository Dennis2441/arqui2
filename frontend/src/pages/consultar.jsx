import React, { useEffect, useState } from 'react';
import { Card, Input, List, Button, Drawer, Typography, Badge, Select, Divider } from 'antd';
import { ShoppingOutlined, EyeOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { FaPen } from 'react-icons/fa6';
import axios from 'axios';
const { Option } = Select;
const { Title, Text } = Typography


// DUMMY DATA XD s

// const productosOriginales = [
//   { id: 1, nombre: "Coca-Cola Lata", cantidad: 10, dias_vencimiento: 30 },
//   { id: 2, nombre: "Pepsi Botella", cantidad: 5, dias_vencimiento: 20 },
//   { id: 3, nombre: "Fanta", cantidad: 3, dias_vencimiento: 25 },
//   { id: 4, nombre: "Sprite", cantidad: 8, dias_vencimiento: 15 },
// ];

export function ConsultaProductos() {

  const [filtro, setFiltro] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [productosOriginales, setProductosOriginales] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/producto/listado') // cambia si usas proxy
      .then(response => {
        setProductosOriginales(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
      });
  }, []);

  // cantidad
  const getColorcantidad = (cantidad) => {
    if (cantidad < 5) return 'red';
    if (cantidad < 8) return 'orange';
    return 'green';
  };

  
  const productosFiltrados = productosOriginales
    .filter(p =>
      p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      p.id_producto.toString().includes(filtro)
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
              borderLeft: `4px solid ${getColorcantidad(item.cantidad)}`,
            }}
            actions={[
              <Button type="link" icon={<EyeOutlined />} onClick={() => mostrarDetalles(item)}>
                Ver
              </Button>
              ,
              <Button  href={`editar-producto/${item.id_producto}`} type="link" icon={<FaPen />}>
                Editar
              </Button>
            ]}
          >
            <Badge
              count={item.cantidad}
              style={{ backgroundColor: getColorcantidad(item.cantidad), marginRight: 8 }}
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
            <p><Text strong>ID:</Text> {productoSeleccionado.id_producto}</p>
            <p><Text strong>Nombre:</Text> {productoSeleccionado.nombre}</p>
            <p><Text strong>cantidad:</Text> {productoSeleccionado.cantidad}</p>
            <p><Text strong>Días para vencer:</Text> {productoSeleccionado.fecha_caducidad}</p>
          </>
        )}
      </Drawer>
    </Card>
  );
};