import React, { useState, useEffect } from "react";
import apiBaseUrl from "../shared/components/utils/Api";
import FootComponent from "../shared/components/footer/FootComponent";
import './salesStyles.css'
import { useAuth0 } from "@auth0/auth0-react";
import { Redirect } from "react-router";

let flag = false
let estadoVenta = "En Proceso"

let lista_productos = []

let lista_precio_unitario = []

let lista_disponibles = []

let contador = []

let i = 0
let j = 0

let indice = 0

let lista_cantidad = []

let lista_articulos = []

let lista_precio_total = []

let costoTotal = 0

let vIdVenta = 10001

let listaVendedores = []

let lista_id_vendedores = []

let lista_id_productos = []

let listaVentaTotal = [0]

let aux;

let IdVentaTotal = 10001;

function SalesPages() 
  {
    const { user, isAuthenticated } = useAuth0();

    const [productos, setProductos] = useState([]);
    const [vendedores, setVendedores] = useState([]);

    const [precio, setPrecio] = useState(0);
    const [disponible, setDisponible] = useState(0);
    const [producto, setProducto] = useState("Seleccione un producto referente a la venta realizada")

    const [cantidad, setCantidad] = useState("")

    const [listaTotalCantiad, setListaTotalCantidad] = useState()

    const [listaTotalArticulos, setListaTotalArticulos] = useState()

    const [listaPrecioTotal, setListaPrecioTotal] = useState()

    const [CostoTotal, setCostoTotal] = useState()

    const [idVenta, setIdVenta] = useState()

    const [mirarIdVendedor, setMirarIdVendedor] = useState("")

    const [nombreCliente, setNombreCliente] = useState("")

    const [idCliente, setIdCliente] = useState("")

    const [fecha, setFecha] = useState("")

    const [vendedor, setVendedor] = useState("Nombre")

    const getProductos = async () => {
      let a = lista_productos.length;

      try {
        const response = await fetch(`${apiBaseUrl}/obtener-productos-bd`);
        const jsonResponse = await response.json();
        const responseProducts = await jsonResponse.data

        if (a > 0 && aux.length > responseProducts.length) {
          window.location.reload();
          flag = true

        }

        ////
        if (a > 0 && aux.length == responseProducts.length) {
          for (i = 0; i < responseProducts.length; i++) {
            if (aux[i].price != responseProducts[i].price) {
              window.location.reload();
              flag = true
            }
            if (aux[i].name != responseProducts[i].name) {
              window.location.reload();
              flag = true
            }
            if (aux[i].stock != responseProducts[i].stock) {
              //alert("Hubo cambios de inventario en el articulo: " + responseProducts[i].nombre)
              if (lista_articulos.length > 0) {
                let flag2 = false
                let auxIndex = -6
                for (j = 0; j < lista_cantidad.length; j++) {
                  if (responseProducts[i].name == lista_articulos[j]) {
                    flag2 = true
                    auxIndex = j
                  }
                }
                if (flag2 == true) {
                  lista_disponibles[i] = responseProducts[i].stock - lista_cantidad[auxIndex]
                }
              }
              else {
                lista_disponibles[i] = responseProducts[i].stock
              }
            }
          }
        }

        aux = jsonResponse.data;

        /////


        for (i = a; i < responseProducts.length; i++) {
          lista_productos.push(responseProducts[i].name)
          lista_precio_unitario.push(parseInt(responseProducts[i].price))
          lista_disponibles.push(responseProducts[i].stock)
          lista_id_productos.push(parseInt(responseProducts[i].id))
          contador.push(0)
        }


        const listProducts = responseProducts.map((pr) =>

          <li key={pr.id}><button id={pr.id} onClick={() => adding(lista_productos.indexOf(pr.name))} className="dropdown-item" type="button">{pr.name}</button></li>

        );
        setProductos(listProducts);
        console.log(jsonResponse.data);
      }
      catch (error) {
        console.log(error)
      }
    }



    const getVendedores = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/obtener-vendedores-bd`);
        const jsonResponse = await response.json();
        const responseVendedores = jsonResponse.data2

        const listVendedores = responseVendedores.map((v) =>

          <li key={v.id}><button id={v.id} onClick={() => { setMirarIdVendedor(v.id); setVendedor(v.name) }} className="dropdown-item" type="button">{v.name}</button></li>

        );
        setVendedores(listVendedores);
        console.log(jsonResponse.data2);
      }
      catch (error) {
        console.log(error)
      }

    }

    const getVentaTotal = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/obtener-venta-total`);
        const jsonResponse = await response.json();
        const responseVentaTotal = jsonResponse.data3

        for (i = 0; i < responseVentaTotal.length; i++) {
          listaVentaTotal.push(responseVentaTotal[i].id)
        }

        if (responseVentaTotal.length > 0) {
          IdVentaTotal = parseInt(responseVentaTotal[responseVentaTotal.length - 1].id) + 1
        }
      }
      catch (error) {
        console.log(error)
      }
    }



    useEffect(() => {
      getVentaTotal();
    }, []);

    if (listaVentaTotal.length > 1) {
      vIdVenta = listaVentaTotal[listaVentaTotal.length - 1] + 1
    }


    const adding = (clicked) => {
      indice = parseInt(clicked)
      getVentaTotal();
      if (contador[indice] == 0) {
        setProducto(lista_productos[indice])
        setDisponible(lista_disponibles[indice])
        setPrecio(lista_precio_unitario[indice])
        document.getElementById("boton_pedido").removeAttribute("disabled", false)
        document.getElementById("texto").removeAttribute("disabled", false)

        for (i = 0; i < lista_productos.length; i++) {
          contador[i] = 0;
        }

        contador[indice] = 1
      }
      else {
        setProducto("Seleccione un producto referente a la venta realizada")
        setDisponible(0)
        setPrecio(0)
        document.getElementById("boton_pedido").setAttribute("disabled", true)
        document.getElementById("texto").setAttribute("disabled", true)
        contador[indice] = 0

      }
    }

    const agregarAlPedido = async () => {
      await getVentaTotal();

      if (parseInt(cantidad) > 0 && lista_disponibles[indice] - parseInt(cantidad) >= 0) {
        /////////////////
        let aux = -1;
        if (lista_articulos.length > 0) {
          for (i = 0; i < lista_articulos.length; i++) {
            if (lista_articulos[i] == lista_productos[indice]) {
              aux = i
            }
          }
          if (aux == -1) {
            lista_cantidad.push(parseInt(cantidad))
            lista_articulos.push(lista_productos[indice])
            lista_precio_total.push(lista_precio_unitario[indice] * parseInt(cantidad))
          }
          if (aux >= 0) {
            lista_cantidad[aux] += parseInt(cantidad)
            lista_precio_total[aux] += lista_precio_unitario[indice] * parseInt(cantidad)
          }
        }
        else {

          lista_cantidad.push(parseInt(cantidad))
          lista_articulos.push(lista_productos[indice])
          lista_precio_total.push(lista_precio_unitario[indice] * parseInt(cantidad))

        }


        ///////////////////////

        // lista_cantidad.push(parseInt(cantidad))
        // lista_articulos.push(lista_productos[indice])
        // lista_precio_total.push(lista_precio_unitario[indice]*parseInt(cantidad))

        setListaTotalCantidad(lista_cantidad.map((j) => <li className="style-list" key={Math.random() + "1a"}>{j}</li>))

        setListaTotalArticulos(lista_articulos.map((j) => <li className="style-list" key={Math.random()}>{j}</li>))

        setListaPrecioTotal(lista_precio_total.map((j) => <li className="style-list" key={Math.random() + "3"}>{j} $</li>))

        lista_disponibles[indice] -= parseInt(cantidad)

        setDisponible(disponible - parseInt(cantidad))

        costoTotal += lista_precio_unitario[indice] * parseInt(cantidad)

        setCostoTotal(costoTotal)

        //setIdVenta(vIdVenta)
        setIdVenta(IdVentaTotal)

        document.getElementById("boton_pedido").setAttribute("disabled", true)
        document.getElementById("texto").setAttribute("disabled", true)
        setProducto("Seleccione un producto referente a la venta realizada")
        setDisponible(0)
        setPrecio(0)
        contador[indice] = 0
      }
    }

    const bVenta = async () => {
      await getProductos();

      await getVentaTotal();

      for (i = 0; i < lista_disponibles.length; i++) {
        if (lista_disponibles[i] < 0) {
          flag = true
        }
      }

      if (lista_cantidad.length > 0) {
        let gVendedor = vendedor
        let gIdVendedor = parseInt(mirarIdVendedor)
        let gNombreCliente = nombreCliente
        let gIdCliente = parseInt(idCliente)
        let gFecha = fecha
        let gIdVenta = IdVentaTotal
        let gCantidadVenta = lista_cantidad
        let gCantidadArticulos = lista_articulos
        let gPrecioTotal = lista_precio_total
        let gDisponible = lista_disponibles
        let gCostoTotal = costoTotal


        if (gIdVendedor <= 0 || gNombreCliente.length <= 0 || gIdCliente <= 0 || gFecha.length <= 0) {
          alert("Faltan Datos")
        }
        else if (flag == true) { window.location.reload(); }
        else {

          const addVenta = async (idp, nombrep, cantidadc, preciocc, idvt, idc, nc, idv, nv, f, p) => {
            var url = `${apiBaseUrl}/agregar-ventas`;
            var data = {
              "idProductos": idp,
              "nombreProducto": nombrep,
              "cantidadCompra": cantidadc,
              "precioCantidadCompra": preciocc,
              "idVentaTotal": idvt,
              "idCliente": idc,
              "nombreCliente": nc,
              "idVendedores": idv,
              "nombreVendedores": nv,
              "fechaVenta": f,
              "estadoVenta": p
            };

            await fetch(url, {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(res => res.json())
              .catch(error => console.error('Error:', error))
              .then(response => console.log('Success:', response));
          }

          for (i = 0; i < lista_cantidad.length; i++) {
            addVenta(lista_id_productos[lista_productos.indexOf(lista_articulos[i])], lista_articulos[i], lista_cantidad[i], lista_precio_total[i], gIdVenta, gIdCliente, gNombreCliente, gIdVendedor, gVendedor, gFecha, estadoVenta);
          }

          const addVentaTotal = async () => {

            var url2 = `${apiBaseUrl}/venta-total`;
            var data2 = {
              "id": IdVentaTotal,
              "TotalVenta": gCostoTotal,
              "cliente": gNombreCliente,
              "idcliente": gIdCliente,
              "vendedor": gVendedor,
              "idVendedor": gIdVendedor,
              "fecha": gFecha,
              "estadoVenta": estadoVenta
            };

            await fetch(url2, {
              method: 'POST',
              body: JSON.stringify(data2),
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(res => res.json())
              .catch(error => console.error('Error:', error))
              .then(response => console.log('Success:', response));
          }

          addVentaTotal();

          /////

          const actualizarInventario = async (idInventario, dispInventario) => {

            var url3 = `${apiBaseUrl}/actualizar-inventario`;
            var data3 = {
              "id": idInventario,
              "d": dispInventario
            };

            await fetch(url3, {
              method: 'POST',
              body: JSON.stringify(data3),
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(res => res.json())
              .catch(error => console.error('Error:', error))
              .then(response => console.log('Success:', response));
          }

          for (i = 0; i < lista_disponibles.length; i++) {
            actualizarInventario(parseInt(lista_id_productos[i]), parseInt(lista_disponibles[i]));
          }

/* 
          console.log(gVendedor)
          console.log(gIdVendedor)
          console.log(gNombreCliente)
          console.log(gIdCliente)
          console.log(gFecha)
          console.log(gIdVenta)
          console.log(gCantidadVenta)
          console.log(gCantidadArticulos)
          console.log(gPrecioTotal)
          console.log(gDisponible)
          console.log(gCostoTotal)
          console.log("lista")
          console.log(lista_id_productos) */


          setMirarIdVendedor(" ")

          const handleReset = () => {
            Array.from(document.querySelectorAll("input")).forEach(
              input => (input.value = "")
            );
          }
          handleReset()


          setIdVenta()
          setListaTotalCantidad()
          setListaTotalArticulos()
          setListaPrecioTotal()
          lista_cantidad = []
          lista_articulos = []
          lista_precio_total = []
          costoTotal = 0
          setCostoTotal()
          setVendedor("Nombre")

          setProducto("Seleccione un producto referente a la venta realizada")
          setDisponible(0)
          setPrecio(0)
          document.getElementById("boton_pedido").setAttribute("disabled", true)
          document.getElementById("texto").setAttribute("disabled", true)
          contador[indice] = 0

          listaVentaTotal.push(vIdVenta)

        }

      }

    }
 
  if (localStorage.getItem("state") === "Vendedor" && isAuthenticated) {
    return (
      <div className="color-ventana">
        <center>
          <h1>Registro de Ventas</h1>
        </center>

        <br />
        <br />

        <div className="container">
          <div className="row">
            <div className="col-3">
              <div className="container">
                <div className="row">
                  <div className="col-4">
                    <label>Vendedor:</label>
                  </div>
                  <div className="col-8">
                    <div className="dropdown">
                      <button onClick={getVendedores} className="btn btn-secondary btn-sm dropdown-toggle style-dropdownMenuButton1" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        {vendedor}
                      </button>
                      <ul id="drop_vendedores" className="dropdown-menu" aria-labelledby="dropdownMenuButton1">

                        {vendedores}


                      </ul>
                    </div>
                  </div>
                </div>

                <br />
                <br />

                <div className="row">

                  <div className="col-6">
                    <label>ID Vendedor:</label>
                  </div>

                  <div className="col-6">
                    <label className="style-label-id_vendedor" id="id_vendedor" >{mirarIdVendedor}</label>
                  </div>

                </div>

                <br />
                <br />

                <div className="row">
                  <label>Nombre Cliente:</label>
                </div>
                <div className="row">
                  <input className="style-input-nombre_cliente" type="text" id="nombre_cliente" onChange={(cc) => setNombreCliente(cc.target.value)} />
                </div>

                <br />

                <div className="row">
                  <div className="col-5">
                    <label>ID Cliente:</label>
                  </div>
                  <div className="col-7">
                    <input className="style-input-id_cliente" type="number" id="id_cliente" onChange={(iid) => setIdCliente(iid.target.value)} />
                  </div>
                </div>

                <br />
                <br />

                <div className="row">

                  <div className="col-12">

                    <label>Fecha de Venta:</label>
                    <br />
                    <input className="style-input-start" type="date" id="start" name="date-start"
                      min="2021-01-01" max="2035-12-31" onChange={(f) => setFecha(f.target.value)} />

                  </div>

                </div>
              </div>
            </div>

            <div className="col-9">
              <div>

                <div className="dropdown style-dropdown">
                  <button onClick={getProductos} className="btn btn-light btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    Seleccione un producto
                  </button>
                  <ul id="lista_productos" className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    {productos}

                  </ul>
                </div>

                <br />
                <br />

                <div className="container">
                  <div className="row">
                    <div className="col">
                      <h4>Producto</h4>
                      <li id="idEquipo" className="lh-1 style-list">{producto}</li>
                    </div>
                    <div className="col">
                      <h4>Libras Disponibles</h4>
                      <li className="style-list" id="disponible"> {'\u00A0'} {'\u00A0'} {'\u00A0'} {'\u00A0'} {'\u00A0'}  {disponible} </li>
                    </div>
                    <div className="col">
                      <h4>Valor Por Libra($)</h4>
                      <li className="style-list" id="valor"> {'\u00A0'} {'\u00A0'} {'\u00A0'} {'\u00A0'} {'\u00A0'} {'\u00A0'} {'\u00A0'} {'\u00A0'} {'\u00A0'} {precio} $</li>
                    </div>

                    <div className="col">

                      <h4>Cantidad Libras</h4>
                      <li className="style-list style-texto" ><input type="number" pattern="\d+" id="texto" disabled onChange={(c) => setCantidad(c.target.value)} /></li>

                    </div>
                  </div>
                </div>



                <br />
                <br />

                <div className="style-div-boton-pedido">
                  <button id="boton_pedido" onClick={agregarAlPedido} type="button" className="btn btn-primary">Añadir al Pedido</button>
                </div>


              </div>
            </div>
          </div>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />

        <div className="container style-div-ventaTotal">

          <h3>Venta Total</h3>
          <label > ID Venta:  </label>
          <label id="id-venta">{'\u00A0'} {idVenta}</label>

          <br />
          <br />
          <br />

          <div className="row">

            <div className="col">

              <b>Cantidad</b>

              <ul id="Cantidad_Venta">

                {listaTotalCantiad}

              </ul>

            </div>

            <div className="col style-div-articulos">
              <b> {'\u00A0'} {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'} Articulos</b>

              <ul id="Cantidad_Articulos">
                {listaTotalArticulos}
              </ul>

            </div>

            <div className="col style-div-precioTotal">
              <b>Precio Total ($)</b>

              <ul id="Cantidad_Precio_Total">
                {listaPrecioTotal}
              </ul>


            </div>

          </div>

          <br />
          <br />

          <div className="row style-div-costoTotal">
            <div className="col-5">
              <b>Costo Total: </b>
            </div>
            <div className="col-7 style-label-costoTotal">
              <label id="Costo_Total">{CostoTotal}</label>
            </div>
          </div>

          <br />
          <br />

          <div className="style-div-button-guardarVenta">
            <button type="button" id="guardar_venta" className="btn btn-success" onClick={bVenta}>Guardar Venta</button>
          </div>


        </div>

        <br />
        <br />
        <br />

      </div>
    );
  }
  else {
    return <Redirect to="/home"></Redirect>
  }
}


export default SalesPages;