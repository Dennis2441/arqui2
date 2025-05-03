import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Acceso } from './hooks/acceso';
import { Login } from './pages/login';
import Home from './pages/home';
import { ConsultaProductos } from "./pages/consultar"
import { RegistrarProducto } from './pages/registrar-producto';
import { EditarProducto } from './pages/editar-producto';
import { Configuracion } from './pages/configuracion';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Acceso />}>  
          {/* RUTAS PRIVADAS */}  
          <Route path="/home" element={<Home />} />  
          <Route path="/registrar-producto" element={<RegistrarProducto />} />
          <Route path="/editar-producto/:id" element={<EditarProducto />} />
          <Route path="/consultar" element={<ConsultaProductos />} />
          <Route path="/configurar" element={<Configuracion />} />
        </Route>  
      </Routes>
    </BrowserRouter>
  );
}

export default App;