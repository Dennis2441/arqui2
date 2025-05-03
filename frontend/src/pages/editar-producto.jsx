
import { Divider } from "antd";
import { FormularioRegistro } from "../components/forms/registrar";

export function EditarProducto(){

  return(
    <div style={{ textAlign: "center" }}>
      <h2>Registrar Producto</h2>
      <Divider />
      <label>Id de Producto: </label> <span>20</span>
      <FormularioRegistro />
    </div>
  )
}