import { Divider, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import { FormularioRegistro } from "../components/forms/registrar";
import { useEffect, useState } from "react";
import axios from "axios";
export function EditarProducto(){

  const { id } = useParams();

  const [producto, setProducto] = useState(null);  
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/producto/${id}`);
        setProducto(response.data);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
        message.error("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      obtenerProducto();
    }
  }, [id]);

  return(
    <div style={{ textAlign: "center" }}>
      <h2>Registrar Producto</h2>
      <Divider />
      <label>Id de Producto: </label> <b>{id}</b>
      
      {loading ? (
        <Spin tip="Cargando..." />
      ) : (
        <FormularioRegistro id={id} producto={producto} />
      )}
    </div>
  )
}