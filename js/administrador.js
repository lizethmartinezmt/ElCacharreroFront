var idUser = 0;
var validations = {
    email: [/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/, 'Por favor ingrese una dirección de email valido']
};
var idNuevo;
window.onload = function() {
    get_ID();

};

function campos_vacios() {
    if ($.trim($("#emailRegistro").val()) == "" ||
        $.trim($("#usuarioRegistro").val()) == "" ||
        $.trim($("#contrasenaRegistro").val()) == "" ||
        $.trim($("#contrasenaRegistro2").val()) == "" ||
        $.trim($("#identificacion").val()) == "" ||
        $.trim($("#direccion").val()) == "" ||
        $.trim($("#celular").val()) == "" ||
        $.trim($("#zona").val()) == "" ||
        $.trim($("#tipo").val()) == "") {
        return false;
    } else {
        return true;
    }
}

function email_validation() {
    const email_val = $("#email").val();
    validation = new RegExp(validations['email'][0]);
    // validar el valor asignado del email
    if (!validation.test(email_val)) {
        // Si la validacion no es correcta se muestra el mensaje de error al usuario
        //dialog(true, validations['email'][1]);
        alert(validations['email'][1])
        return false;
    } else {
        // Si la validacion es correcta retorna verdadero
        return true;
    }
}

function URL_BASE() {
    const protocol = "http://";
    const base_api = "/api/";
    if (hosting) {
        url = "http://" + ip_local + ":8080/api/";
        return url;
    }
    url = "http://" + ip_server + ":8080/api/";
    return url;
};

function URL_GET_EMAIL(email) {
    return URL_BASE() + "user/emailexist/" + email;
}

function URL_GET_USER(email, password) {
    return URL_BASE() + "user/" + email + "/" + password;
}

$("#login").click(function() {
    if ($.trim($("#email").val()) == "" || $.trim($("#password").val()) == "") {
        if ($.trim($("#email").val()) == "" && $.trim($("#password").val()) == "") {
            alert("Por favor ingrese el correo y la contraseña");
        } else if ($.trim($("#email").val()) == "") {
            alert("Por favor ingrese el correo");
        } else if ($.trim($("#password").val()) == "") {
            alert("Por favor ingrese la contraseña");
        }
    } else if (email_validation() == true) {
        let datos = {
            email: $("#email").val(),
            password: $("#password").val()
        }
        $.ajax({
            url: "http://129.151.122.91:5500/api/user/" + datos.email + "/" + datos.password,
            method: "GET",
            dataType: "json",
            success: function(response) {
                if (response.password == null) {
                    alert("Los datos ingresados no existen en la base de datos, recuerda realizar el registro")
                } else if (response.password == datos.password) {
                    alert("Contraseña Incorrecta")
                } else {
                    console.log(response);
                    window.location.href = "../index.html";
                }
            },
            error: function(xhr, status) {
                console.log(xhr);
                console.log(status);
            }
        });
    }
});

function get_ID() {
    $.ajax({
        url: "http://129.151.122.91:5500/api/user/newid",
        method: "GET",
        dataType: "JSON",
        //function(json) - funcion anonima
        success: function(response) {
            //window.location.href = "../html/usuarios.html";
            idNuevo = response;
        },
        error: function(xhr, status) {
            alert('Ha sucedido un problema, Vuelva a iniciar ' + xhr.status);
        }
    });
}

$("#guardar").click(function() {
    let campos = campos_vacios();
    if (campos == false) {
        alert("Por favor ingrese todos los campos");
        console.log(campos_vacios())
    } else {
        if ($("#contrasenaRegistro").val() == $("#contrasenaRegistro2").val()) {
            let datos = {
                id: idNuevo,
                email: $("#emailRegistro").val(),
                password: $("#contrasenaRegistro").val(),
                name: $("#usuarioRegistro").val(),
                identification: $("#identificacion").val(),
                address: $("#direccion").val(),
                cellPhone: $("#celular").val(),
                zone: $("#zona").val(),
                type: $("#tipo").val()
            }
            $.ajax({
                url: "http://129.151.122.91:5500/api/user/new",
                method: "POST",
                dataType: "JSON",
                data: JSON.stringify(datos),
                contentType: "application/json",
                Headers: {
                    "Content-Type": "application/json"
                },
                statusCode: {
                    201: function(response) {
                        //window.location.href = "../html/usuarios.html";
                        console.log(response);
                    }
                }
            });
        } else {
            alert("Las contraseñas no coinciden");
        }
    }
});

function consultar() {
    $.ajax({
        url: 'http://129.151.122.91:5500/api/user/all',
        type: 'GET',
        dataType: 'JSON',
        //function(json) - funcion anonima
        success: function(respuesta) {
            // capa div - resultado
            $("#resultado").empty();
            for (i = 0; i < respuesta.length; i++) {
                $("#resultado").append("<tr>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].identification + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].name + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].email + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].password + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].address + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].cellPhone + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].zone + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].type + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append('<td><button type="button" onclick="eliminar(' + respuesta[i].id + ')" class="btn btn-danger btn-block">BORRAR</button><button type="button" onclick="editmodal(' + respuesta[i].id + ')" class="btn btn-success btn-block">EDITAR</button></td>');
                $("#resultado").append("</tr>")
            };
            console.log(respuesta);
        },
        error: function(xhr, status) {
            alert('Ha sucedido un problema, ' + xhr.status);
        },
        complete: function(xhr, status) {
            //status - es el estado de codigo
            alert('Petición realizada, ' + xhr.status);
        }
    });
}

function eliminar(id) {
    let myData = {
        id: id
    }
    let dataToSend = JSON.stringify(myData)
    $.ajax({
        url: "http://129.151.122.91:5500/api//user/" + id,
        type: 'DELETE',
        datatype: "JSON",
        success: function(repuesta) {
            $("#resultado").empty();
            consultar();
            console.log(json);
            console.log("idClient", dataToSend)
            debugger
        },
        error: function(xhr, status) {
            alert('ha sucedido un problema' + xhr.status);
        },
        complete: function(xhr, status) {
            alert('Petición realizada ' + xhr.status);
            //limpiarFormulario();
        }
    });
}

function editmodal(id) {
    $('#exampleModal').modal('show');
    this.idUser = id;
    return this.idUser;
}

function editar() {
    let campos = campos_vacios();
    let idEditar = this.idUser;
    let myData = {
        id: idEditar,
        email: $("#emailRegistro").val(),
        password: $("#contrasenaRegistro").val(),
        name: $("#usuarioRegistro").val(),
        identification: $("#identificacion").val(),
        address: $("#direccion").val(),
        cellPhone: $("#celular").val(),
        zone: $("#zona").val(),
        type: $("#tipo").val()
    }
    let dataTosend = JSON.stringify(myData);
    if (campos == false) {
        alert("Por favor ingrese todos los campos");
    } else {
        if ($("#contrasenaRegistro").val() == $("#contrasenaRegistro2").val()) {
            $('#exampleModal').modal('hide');
            $.ajax({
                url: "http://129.151.122.91:5500/api/user/update",
                type: "PUT",
                data: dataTosend,
                contentType: "application/JSON",
                dataType: 'JSON',
                success: function(respuesta) {
                    $("#resultado").empty();
                    $("#idClient").val("");
                    $("#emailRegistro").val("");
                    $("#contrasenaRegistro").val("");
                    $("#usuarioRegistro").val("");
                    $("#identificacion").val("");
                    $("#direccion").val("");
                    $("#celular").val("");
                    $("#zona").val("");
                    $("#tipo").val("");
                    consultar();
                },
                error: function(xhr, status) {
                    alert('Ha sucedido un problema' + xhr.status);
                },
                complete: function(xhr, status) {
                    alert('Petición realizada' + xhr.status);
                    //limpiarFormulario();
                }
            });
        } else {
            alert("Las contraseñas no coinciden");
        }
    }

}