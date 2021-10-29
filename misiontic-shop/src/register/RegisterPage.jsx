import React, {  useState, useEffect ,Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Redirect } from "react-router";
import ForbidenComponent from "../shared/components/forbiden/ForbidenComponent";
import apiBaseUrl from "../shared/components/utils/Api";





/*  const [products, setProducts] = useState([]);
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((product) =>
<tr>
<th scope="row">product.id</th>
<td>product.name</td>
<td>product.price</td>
<td>product.stock</td>
<td>product.description</td>
<td>product.status</td>
     </tr>
     
   );
   const getProducts = async () => {
     try {
       const response = await fetch("http://localhost:3001//add-product");
       const jsonResponse = await response.json();
       const responseProducts = jsonResponse.data;
       const listProducts = responseProducts.map((product) =>
       <tr>
       <th scope="row">{product.id}</th>
       <td>{product.name}</td>
       <td>{product.price}</td>
       <td>{product.stock}</td>
       <td>{product.description}</td>
       <td>{product.status}</td>
       </tr>
       );
       setProducts(listProducts)
       console.log(jsonResponse.data);
      }
      catch (error) {
        
        console.log(error)
      }
      
    }
    useEffect(() => {
      getProducts();
    }, []);
    */
   
const RegisterPage = ()=> {

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const addProduct = async () => {
    const productData = {
      name: productName,
      price: price,
      stock: stock,
      description: description,
      status: status

    }
    const response = await fetch(`${apiBaseUrl}/add-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
      

    });
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    const handleReset = () => {
      Array.from(document.querySelectorAll("input")).forEach(
        input => (input.value = "")
      );
    }
    handleReset()

  }

  const { user, isAuthenticated } = useAuth0();
  if (localStorage.getItem("state") === "Vendedor" && isAuthenticated) {
    return (
      <Fragment>
        <div className="container">
          <center>
            <div>
         
            </div>
            <div> <center>
              <br />
              <h1>Registro de Productos</h1>  </center>

              <div className="text-center text-primary mt-1 text-light"></div>

              <form action="" enctype="multipart/form-data">
                <div className="row row-col-12 col-6 form -group p-5">
                  <div className="col-12 col- 6 sm">
                    <label className="d-block my-2 text-light" for="">Nombre de Producto</label>
                    <input required className="form-control" type="text" placeholder="Nombre del Producto" onChange= {(e)=>setProductName(e.target.value)}/>
                  </div>

                  <div className="col-12">
                    <label className="d-block my-2 text-light" for="">Valor Unitario</label>
                    <input required className="form-control" type="number" placeholder="Valor Unitario" onChange= {(e)=>setPrice(e.target.value)} />
                  </div>

                  <div className="col-12">
                    <label className="d-block my-2 text-light" for="">Existencia</label>
                    <input required className="form-control" type="number" placeholder="Existencia" onChange={(e) => setStock(e.target.value)}/>
                  </div>

                  <div className="col-12">
                    <label className="d-block my-2 text-light" for="">Descripción del Producto</label>
                    <input required className="form-control" type="text" placeholder="Descripción del Producto" onChange={(e) => setDescription(e.target.value)} />
                  </div>


                  <div className="col-12">
                    <label className="d-block my-2 text-light" for="">Estado del Producto</label>
                    <input required className="form-control" type="text" placeholder="Estado del Producto" onChange={(e) => setStatus(e.target.value)} />
                  </div>

                  {/* <div className="col-12">
                    <label className="d-block my-2 text-light" for="">Estado del producto</label>
                    <select required name="Estado producto" id="" className="form-control" onChange={(e) => setStatus(e.target.value)}>
                      <option value="" selected>Seleccione</option>
                      <option value="1">Disponible</option>
                      <option value="2">No disponible</option>
                    </select>
                  </div> */}

                  <div className="d-flex justify-content-center">
                    <input type="button" onClick={addProduct} className="btn btn-light mt-5 col-4"  value="Registrar" />
                  </div>
                </div>
              </form>
            </div>


          </center>

        </div >

      </Fragment>
    );
  }
  else {
    return <ForbidenComponent />
      
  }
}
      export default RegisterPage;
