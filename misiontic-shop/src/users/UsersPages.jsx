import React, { useEffect, useState, useRef } from 'react';
//
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, Tooltip } from '@mui/material';
//import { Redirect } from "react-router";

//import apiBaseUrl from '../utils/Api.jsx'
//import FootComponent from "../shared/components/footer/FootComponent";
import apiBaseUrl from '../shared/components/utils/Api';

function UsersPages() {
    const { user, isAuthenticated } = useAuth0();
    //if (localStorage.getItem("state") === "Vendedor"  && isAuthenticated) {
    //const NuevoUsuario = () => {


        const [mostrarTabla, setMostrarTabla] = useState(true);
        const [textoBot, setTextoBot] = useState('Crear Nuevo Usuario');
        const [cargaUsuarios, setCargaUsuarios] = useState([]);




        //Actualizar datos en la carga de la pagina
        // useEffect(()=>{
        //     console.log('Hola,soy un effect');
        // },[]);


        useEffect(() => {
            if (mostrarTabla) {
                setTextoBot('Crear Nuevo Usuario');
            } else {
                setTextoBot('Mostrar Tabla');
            }

        }, [mostrarTabla]);




        return (
            <div>

                <button
                    onClick={() => {
                        setMostrarTabla(!mostrarTabla);
                    }}
                    type='button'
                    className="btn btn-secondary">
                    {textoBot}
                </button>

                {mostrarTabla ? (
                    <TablaUsuarios listaUsuarios={cargaUsuarios} />
                ) : (
                    <FormularioUsuario
                        funcMostrarTabla={setMostrarTabla}
                        funcAgregarusuario={setCargaUsuarios}
                        listaUsuarios={cargaUsuarios} />)}
                <ToastContainer position='bottom-center' autoClose={5000} />


            </div>
        )
    }
    const FormularioUsuario = ({ funcMostrarTabla, funcAgregarusuario, listaUsuarios }) => {
        const form = useRef(null);
        const varNuevoUsuario = {};
        const submitForm = (e) => {
            e.preventDefault()
            const fd = new FormData(form.current);


            fd.forEach((value, key) => {
                varNuevoUsuario[key] = value;
            })
            funcMostrarTabla(true);


            toast.success('usuario agregado con exito.')
            agregarUsuario();
            // funcAgregarusuario([...listaUsuarios,varNuevoUsuario])
        }

        const agregarUsuario = async () => {

            const object = {
                name: varNuevoUsuario.name,
                email: varNuevoUsuario.email,
                role: varNuevoUsuario.role
            };

            const response = await fetch(`${apiBaseUrl}/add-users`, {
                method: 'POST',
                body: JSON.stringify(object),

                headers: {

                    'content-Type': 'application/json'
                }
            });


            const responseText = await response.text();
            console.log(responseText); // logs 'OK'
        }

        return (
            <div>
                Crear nuevo usuario
                <form ref={form} onSubmit={submitForm} className='flex-col'>
                    <h2>Formulario de creacion de usuario</h2>
                    <label htmlFor='nombre'>
                        Nombre de usuario
                        <input
                            name='name'
                            type="text"
                            placeholder='Nombre del usuario'
                            required

                        />
                    </label>


                    <label htmlFor='role'>
                        Cargo de usuario
                        <select placeholder='pas usuario' name='role' className="" id="" required defaultValue={0} >
                            <option disabled value={0}>Seleccione una opción</option>
                            <option value="1"> Administrador</option>
                            <option value="2">Vendedor</option>

                        </select>

                    </label>
                    <label htmlFor='email'>
                        Contraseña del usuario
                        <input
                            name='email'
                            type="text"
                            placeholder='email del usuario'
                            required
                        />
                    </label>


                    <button
                        type='submit' onClick={submitForm} className='bg-indigo-500 text-white'>Guardar Datos</button>

                </form>
            </div>
        )
    }


    const TablaUsuarios = ({ funcMostrarTabla }) => {
        const [products, setProducts] = useState([]);





        const FilaUsuario = ({ product }) => {
            const [edit, setEdit] = useState(false)
            const [infoNewUser, setInfoNewUser] = useState({
                name: product.name,
                email: product.email,
                role: product.role,
            })
            const [openDialog, setOpenDialog] = useState(false)
            const actualizarUsuario = async () => {
                try {
                    const object = {
                        id: product.id,
                        name: infoNewUser.name,
                        email: infoNewUser.email,
                        role: infoNewUser.role
                    };

                    const response = await fetch(`${apiBaseUrl}/update-users`, {
                        method: 'PUT',
                        body: JSON.stringify(object),

                        headers: {

                            'content-Type': 'application/json'
                        }
                    })
                    setEdit(!edit);
                    getProducts();
                    ;
                    const responseText = await response.text();
                    console.log(responseText); // logs 'OK'





                }
                catch (error) {
                    console.log(error);
                }
            };
            const eliminarUsuario = async () => {
                try {

                    console.log(product.id);
                    const response = await fetch(`${apiBaseUrl}/delete-users`,

                        {
                            method: 'DELETE',
                            body: JSON.stringify({ id: product.id }),
                            headers: {

                                'content-Type': 'application/json'
                            }

                        })
                    getProducts();
                    setOpenDialog(false);
                    ;
                    const responseText = await response.text();
                    console.log(responseText); // logs 'OK'

                }
                catch (e) {

                }


            }

            // useEffect(()=>{
            //     console.log('busqueda',busqueda);
            //     console.log('lista original',product);
            //     console.log('lista filtrada',product.filter((elemnto)=>{
            //         console.log('elemnto',elemnto);
            //         return JSON.stringify(elemnto).toLowerCase().includes(busqueda.toLowerCase());
            //             })
            //     );

            // },[busqueda]);   

            return (


                <tr>
                    {edit ? (
                        <>
                            <td><input type="text" value={infoNewUser.name} onChange={(e) => setInfoNewUser({ ...infoNewUser, name: e.target.value })} /></td>
                            <td><input type="text" value={infoNewUser.email} onChange={(e) => setInfoNewUser({ ...infoNewUser, email: e.target.value })} /></td>
                            <td><input type="text" value={infoNewUser.role} onChange={(e) => setInfoNewUser({ ...infoNewUser, role: e.target.value })} /></td>
                        </>
                    ) : (
                        <>
                            <th scope="row">{product.id}</th>
                            <td>{product.name} </td>
                            <td>{product.email}</td>
                            <td>{product.role}</td>
                        </>)}
                    <td>
                        <div>
                            {edit ? (
                                <>
                                    <Tooltip title='Guardar Cambios'><i onClick={() => actualizarUsuario()} className='fas fa-check' /></Tooltip>
                                    <Tooltip title='Cancelar'><i onClick={() => setEdit(!edit)} className='fas fa-ban' /></Tooltip>
                                </>

                            ) : (
                                <>
                                    <i onClick={() => setEdit(!edit)} className='fas fa-pencil-alt text-yellow-700 hover:text-yellow-400' />
                                    <i onClick={() => setOpenDialog(true)} className='fas fa-trash' />

                                </>

                            )}



                        </div>
                        <Dialog open={openDialog}>
                            <div>
                                <h1>¿Está seguro que quiere eliminar el usuario?</h1>
                                <button type="button" className="btn btn-success" onClick={() => eliminarUsuario()}>si</button>
                                <button type="button" className="btn btn-danger" onClick={() => setOpenDialog(false)}>no</button>
                            </div>
                        </Dialog>
                    </td>
                </tr>

            )

        }

        const getProducts = async () => {
            try {

                const response = await fetch(`${apiBaseUrl}/get-users`);
                const jsonResponse = await response.json();
                const responseProducts = jsonResponse.data;
                const listProducts = responseProducts.map((product) =>
                    <FilaUsuario product={product} />

                )
                setProducts(listProducts);
                console.log("get ok");

            }
            catch (error) {
                console.log(error);
            }
        };

        useEffect(() => {
            getProducts();
        }, []);
        return (

            <div>
                tabla
                <table className="table table-striped table-hover">   <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">name</th>
                        <th scope="col">email</th>
                        <th scope="col">role</th>
                        <th scope='col'>Acciones</th>
                    </tr>
                </thead>
                    <tbody>
                        {products}

                    </tbody>
                </table>
            </div>
        )
    }
    //}

   /*  else {
        return <Redirect to="/home"></Redirect>
    } */


export default UsersPages;