var contrasena = document.getElementById("contrasena");
var correo = document.getElementById("correo");
var contraconfirm = document.getElementById("contraconfirm");
var expCorreo = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
var expcontrasena = /^(?=.*[A-Za-z])(?=.\d)[A-Za-z\d]{8,}$/;

function limpiarErrores(){

    var error = document.getElementsByName("error");
    for (var i = 0; i< error.length; i++){

        error[i].innerHTML= "";
    }

}


function validacion(formulario){
    limpiarErrores();
    if (!expCorreo.test(formulario.correo.value)){
        document.getElementById("ErrorCorreo").innerText="El correo debe contener @ y un dominio"; 

        formulario.correo.focus();

        return false;
    }


    if (!expcontrasena.test(formulario.contrasena.value)){

        document.getElementById("ErrorContrasena").innerText="La contaseña debe contener 8 carácteres entre letras y números";

        formulario.contrasena.focus();

        return false;


    }
    if (formulario.contrasena.value != contraconfirm){ 
        document.getElementById("ErrorConfirmarContrasena").innerText="Las contraseñas no coinciden";
    
        formulario.contraconfirm.focus();
        return false;
    }



        else {return true;}
        alert("Su registro se ha realizado satisfactoriamente")

    
}