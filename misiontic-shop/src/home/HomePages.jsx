import React, { useState, useEffect } from "react";
import "./homeStyles.css";
import FootComponent from "../shared/components/footer/FootComponent";
import { useAuth0 } from "@auth0/auth0-react";
import ForbidenComponent from "../shared/components/forbiden/ForbidenComponent";
import apiBaseUrl from "../shared/components/utils/Api";


function HomePages() {
    const {user, isAuthenticated} = useAuth0();
    const [products, setProducts] = useState([]);
    const [validUser, setValidUser] = useState(false);
    const { loginWithRedirect } = useAuth0();
    /* const numbers = [1, 2, 3, 4, 5];
    const listItems = numbers.map((product) =>
        <tr>
            <th scope="row">product.id</th>apiBaseUrl
            <td>product.name</td>
            <td>product.price</td>
            <td>product.stock</td>
            <td>product.description</td>
            <td>product.status</td>
        </tr>

    ); */

    const updateProduct = async (product) => {
        alert(product.id)
    }

    const getProducts = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/get-products`);
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

    
    const validateUserRole = async () => {
        //const response = await fetch(`http://localhost:3001/get-user?email=${user.email}`);

        try {
           
            const response = await fetch(`${apiBaseUrl}/get-user?email=${user.email}`);
            const jsonResponse = await response.json();
            return jsonResponse;
        }
        catch (error) {
            console.log(error);
    }
    }
    const granAcces = async () => {
        try {
            let userData;

            if (isAuthenticated) {
                userData = await validateUserRole();
                console.log(userData);
            }
            else {
                /*  window.location.href ="https://dev-j-0qzk0v.us.auth0.com/u/login?state=hKFo2SBVd2Nob1dxWkZrakU5d1FZQlhwaU1UTmVUMUpFY0VkaaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIEhLZUkzc0g4N0RubWpBZklaWENqa2xDMXVUUlBtQm5ko2NpZNkgY0N1a0ZzNWVtSUhrWVZsOGFZRk5DMm5WYUVMRnUwVzY" */
                if (!verifySesion()) {
                    loginWithRedirect();
                }

                setValidUser(false);
                return;
            }

            if (userData) {
                if (userData.role !== "Invitado") {
                    setValidUser(true);
                    localStorage.setItem("state", userData.role);
                    console.log(userData.role);
                    await getProducts();
                }

                else {
                    localStorage.setItem("state", userData.role);
                    setValidUser(false);

                }
            }
            else {
                localStorage.setItem("state", userData.role);
                setValidUser(false);
            }

       }catch (error) {
            console.log(error);
    }
    }


    const verifySesion = () => {
        
        const cookies = document.cookie;
        let state = false;
        if (cookies.includes("auth0")) {
            state = true;
        }
        return state;
    }

    useEffect(() => {
        granAcces();
        //getProducts(); 
    }, [isAuthenticated, validUser]);
    
        return (

            <div className="container">
                {validUser ? <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">NAME</th>
                            <th scope="col">PRICE</th>
                            <th scope="col">STOCK</th>
                            <th scope="col">DESCRIPTION</th>
                            <th scope="col">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                       {products}
                    </tbody>
                </table>: <ForbidenComponent/>}
            </div>



        )
    
}


export default HomePages;