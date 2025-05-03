
import { Divider } from "antd";
import { FormularioRegistro } from "../components/forms/registrar";

export function RegistrarProducto(){
  return(
    <div style={{ textAlign: "center" }}>
      <h2>Registrar Producto</h2>
      <Divider />
      <FormularioRegistro />
    </div>
  )
}