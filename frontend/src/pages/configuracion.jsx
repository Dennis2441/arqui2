import React, { useState } from 'react';
import { Card, Typography, Slider, Switch, Row, Col } from 'antd';
import Sketch from 'react-p5';

const { Title, Text } = Typography;

export function Configuracion () {
  const [temperatura, setTemperatura] = useState(50);
  const [luzEncendida, setLuzEncendida] = useState(false);
  const [ventiladoresEncendidos, setVentiladoresEncendidos] = useState(false);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(300, 200).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.background(240);
    p5.fill(0);
    p5.textSize(16);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(`Temp: ${temperatura}°`, 150, 30);

    if (luzEncendida) {
      p5.fill('yellow');
      p5.ellipse(75, 100, 40);
    } else {
      p5.noFill();
      p5.stroke(0);
      p5.ellipse(75, 100, 40);
    }

    if (ventiladoresEncendidos) {
      p5.fill('lightblue');
      p5.ellipse(225, 100, 40);
    } else {
      p5.noFill();
      p5.stroke(0);
      p5.ellipse(225, 100, 40);
    }
  };

  return (
    <Card
      title={<Title level={4}>⚙️ Configurar Sensores</Title>}
      style={{ width: '100%', maxWidth: 700, margin: '0 auto' }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Text strong>Control de temperatura</Text>
          <Slider
            min={0}
            max={100}
            value={temperatura}
            onChange={setTemperatura}
            marks={{ 0: '0', 25: '25', 75: '75', 100: '100' }}
          />
        </Col>

        <Col span={24}>
          <Row justify="space-between">
            <Text>Encender Luz</Text>
            <Switch checked={luzEncendida} onChange={setLuzEncendida} />
          </Row>
        </Col>

        <Col span={24}>
          <Row justify="space-between">
            <Text>Encender Ventiladores</Text>
            <Switch checked={ventiladoresEncendidos} onChange={setVentiladoresEncendidos} />
          </Row>
        </Col>

        <Col span={24}>
          <Sketch setup={setup} draw={draw} />
        </Col>
      </Row>
    </Card>
  );
}
