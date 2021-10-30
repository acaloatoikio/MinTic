import React, { Fragment, useState, useEffect } from "react";
import './EstadoVentaStyle.css';
import apiBaseUrl from "../shared/components/utils/Api";

function sSales() {

  // Definición del estado para todos los inputs
  const [state, setState] = useState({
    estadoVenta: "",
    id:null
  })
  const [data, setData] = useState(null)

  // Función para capturar en tiempo real el valor de cada input
  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = (idVenta) => {
    setState({
      ...state,
      id: idVenta,
    });
  };

  const handleUpdate =()=>{
    let sendData = {id: state.id, estadoVenta: state.estadoVenta}
    fetch(`${apiBaseUrl}/update-estadoVenta`,{
      method: 'PUT',
      body:JSON.stringify(sendData),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response =>  window.location.reload(true));

  };

  // Función para validar que los inputs capturaron su valor
  const fetchData = () => {
    fetch(`${apiBaseUrl}/obtener-venta-total`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setData(data.data3)
      })
  }

  // Método de react para hacer la primer petición y traer todos los datos
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Fragment>
      <NavbarComponent />
      <h1 className="centrado">Listado de Ventas</h1>
      <div className="container">
        {/* <nav className="navbar navbar-light bg-light">
          <div className="input-group mb-3">
            <button className="btn btn-outline-info" type="button" id="button-addon1" >Buscar</button>
            <input type="text" className="form-control" placeholder="Buscar Venta" aria-label="Example text with button addon" aria-describedby="button-addon1"/>
          </div>
        </nav> */}
        <table className="table table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Fecha Venta </th>
              <th scope="col">Identificación Cliente</th>
              <th scope="col">Nombre Cliente</th>
              <th scope="col">Total Venta </th>
              <th scope="col">Estado</th>
              <th scope="col">Update</th>
            </tr>
          </thead>
          <tbody>
            {data !== null ?
              data.map((label, index) =>
                <tr key={index}>
                  <th scope="row">{label.id}</th>
                  <td>{label.fecha}</td>
                  <td>{label.idcliente}</td>
                  <td>{label.cliente}</td>
                  <td>{label.TotalVenta}</td>
                  <td>{label.estadoVenta}</td>
                  <td>

                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>handleClick(label.id)}>
                      <i className="fas fa-sync-alt"></i>
                    </button>


                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Cambio de Estado</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div className="modal-body">
                            <div className="form-check">
                              <input className="form-check-input" type="radio" name="estadoVenta" value="Entregado" id="flexRadioDefault1" onChange={handleChange}/>
                              <label className="form-check-label" htmlFor="flexRadioDefault1">
                                Entregado
                              </label>
                            </div>
                            <div className="form-check">
                              <input className="form-check-input" type="radio" name="estadoVenta" value="Cancelado" id="flexRadioDefault2" onChange={handleChange}/>
                              <label className="form-check-label" htmlFor="flexRadioDefault2">
                                Cancelado
                              </label>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleUpdate} >Enviar</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            
                          </div>
                        </div>
                      </div>
                    </div>


                  </td>

                </tr>
              )
              : console.log("No hay datos")}
          </tbody>
        </table>
      </div>
    </Fragment>

  )
}

export default sSales;
