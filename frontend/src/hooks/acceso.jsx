import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { FaPen, FaChartColumn, FaGear , FaPlus, FaBarsProgress, FaLaptop, FaFile, FaMagnifyingGlass } from 'react-icons/fa6'

const { Content, Sider } = Layout;

export function Acceso() {
  // Obtenemos el usuario
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));

  // Verificamos si el usuario existe y tiene un nombre de usuario
  if (usuario) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sider breakpoint="lg" collapsedWidth="0" width={260}>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "16px" }} >Ciencias y Sistemas</span>
            <br />
            <span style={{ color: "orange", fontWeight: "light", fontSize: "12px" }}>¡Lo Mejor del Mundo!</span>
          </div>

          <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']}>
            <Menu.Item key="dashboard" icon={<FaChartColumn />}>
              <Link to="/home">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="registrar-producto" icon={<FaPlus />}>
              <Link to="/registrar-producto">Registrar Producto</Link>
            </Menu.Item>
            <Menu.Item key="editar-producto" icon={<FaPen />}>
              <Link to="/editar-producto">Editar Producto</Link>
            </Menu.Item>
            <Menu.Item key="consultar" icon={<FaMagnifyingGlass />}>
              <Link to="/consultar">Consultas</Link>
            </Menu.Item>
            <Menu.Item key="sensores" icon={<FaLaptop />}>
              <Link to="/sensores">Monitoreo de Sensores</Link>
            </Menu.Item>
            <Menu.Item key="reportes" icon={<FaFile />}>
              <Link to="/reportes">Reportes</Link>
            </Menu.Item>
            <Menu.Item key="configurar" icon={<FaGear  />}>
              <Link to="/configurar">Configuraciones</Link>
            </Menu.Item>
            {/* Mostrar opción solo si el usuario es 'adm' */}
            {usuario.username === 'adm' && (
              <Menu.Item key="admin" icon={<UserOutlined />}>
                <Link to="/admin">Administración</Link>
              </Menu.Item>
            )}
          </Menu>
        </Sider>

        {/* Área principal para el contenido que cambia con Outlet */}
        <Layout>
          <Content style={{ margin: '24px 16px', padding: 24 }}>
            <Outlet />
          </Content>
        </Layout>

      </Layout>
    );
  } else {
    return (
      <Layout>
        <center>
          <h1>No ha iniciado sesión</h1>
          <br />
          <Link to={'/'}>Regresar a inicio</Link>
        </center>
      </Layout>
    );
  }
}