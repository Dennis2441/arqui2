import React, { useState } from 'react';
import { Card, Button, Typography, Row, Col, Divider } from 'antd';

const { Title, Text } = Typography;

export const RefrigeradorVirtual = () => {
  const [items, setItems] = useState([]);

  const agregarItem = (tipo) => {
    const nuevo = { tipo, id: Date.now() };
    setItems((prev) => [...prev, nuevo]);
  };

  const quitarItem = () => {
    setItems((prev) => prev.slice(0, -1));
  };

  const renderItem = (item) => {
    let estilo = { padding: 8, borderRadius: 6, color: 'white', fontWeight: 'bold', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' };

    if (item.tipo === 'Agua') {
      estilo.background = 'linear-gradient(to top, #4fc3f7, #81d4fa)';
    } else if (item.tipo === 'Jugo') {
      estilo.background = 'linear-gradient(to top, #81c784, #c5e1a5)';
    } else if (item.tipo === 'Leche') {
      estilo.background = 'linear-gradient(to top, #ffa726, #ffe0b2)';
    }

    return (
      <div key={item.id} style={{ ...estilo, width: 60, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {item.tipo}
      </div>
    );
  };

  return (
    <Card title={<Title level={4}>🧊 Refrigerador Virtual</Title>} style={{ maxWidth: 500, margin: 'auto', textAlign: 'center' }}>
      <Row gutter={[8, 8]} justify="center">
        <Col>
          <Button onClick={() => agregarItem('Agua')}>Agregar Agua</Button>
        </Col>
        <Col>
          <Button onClick={() => agregarItem('Jugo')}>Agregar Jugo</Button>
        </Col>
        <Col>
          <Button onClick={() => agregarItem('Leche')}>Agregar Leche</Button>
        </Col>
        <Col>
          <Button danger onClick={quitarItem}>Quitar Producto</Button>
        </Col>
      </Row>

      <Divider>Refrigerador</Divider>

      <div style={{
        height: 300,
        background: '#2b2b2b',
        borderRadius: 8,
        padding: 12,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {items.length === 0 ? (
          <Text type="secondary">Vacío 🥶</Text>
        ) : (
          items.map(renderItem)
        )}
      </div>
    </Card>
  );
};
