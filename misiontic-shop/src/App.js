import React, { Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from "./login/LoginPage";
import RegisterPage from "./register/RegisterPage";
import SalesPages from "./sales/SalesPages";
import UsersPages from "./users/UsersPages";
import HomePages from "./home/HomePages";
import sSales from "./statuss/sSales";
import{BrowserRouter as Router, Switch, Route} from "react-router-dom"
import NavbarComponent from "./shared/components/navbar/NavbarComponent";
import ForbidenComponent from "./shared/components/forbiden/ForbidenComponent";



function App() {
 
  return (
    <Router>
      <NavbarComponent title="Misión TIC" title1="La Tienda del Grupo 23" />

      <Switch>
         <Route path="/home" exact>
          <HomePages />
        </Route>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Route path="/register" exact>
          <RegisterPage />
        </Route>
        <Route path="/sales" exact>
          <SalesPages />
        </Route>
        <Route path="/users" exact>
          <UsersPages />
        </Route>
        <Route path="/statuss" exact>
          <sSales />
        </Route>
        <Route path="/forbiden" exact>
          <ForbidenComponent/>
        </Route> 
      </Switch>

      /* Ingresar el footer */
    </Router>
  
  );
}

export default App;
