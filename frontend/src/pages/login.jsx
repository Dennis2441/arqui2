import { useEffect } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { useNavigate } from "react-router";
import axios from 'axios'; // Asegúrate de tener axios instalado  

const { Title } = Typography;

export function Login() {
  const navigate = useNavigate();

  const submit = async (data) => {
    const { username, password } = data;

    // Verificación para "adm"  
    if (username === 'adm') {
      if (password === '123') {
        window.localStorage.setItem('usuario', JSON.stringify({ username, role: 'adm' }));
        navigate('/home');
      } else {
        alert('Contraseña incorrecta para admin');
      }
      return; // Termina la ejecución si es "adm"  
    }

    // Autenticación para "doctor" o "encargado"  
    try {
      const response = await axios.post('http://localhost:3000/api/login', data);
      window.localStorage.setItem('usuario', JSON.stringify(response.data));
      navigate('/home');
    } catch (error) {
      const message = error.response?.data.message || 'Error en el inicio de sesión';
      alert(message);
    }
  };

  useEffect(() => {
    const usr = localStorage.getItem('usuario');
    if (usr) {
      navigate('/home');
    }
  }, []);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>

      <Card style={{ width: 400, padding: 20 }}>
        <Title level={2} style={{ textAlign: "center" }}>Login</Title>
        <Form name="form-login" onFinish={submit} layout="vertical">
          <Form.Item
            label={"Nombre de usuario"}
            name={'username'}
            rules={[{ required: true, message: "Ponele ganas a la vida!" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: "Sos bien especial >:v!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>

      </Card>

    </div>
  );
}  