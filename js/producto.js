var idUser = 0;
var validations = {
    email: [/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/, 'Por favor ingrese una dirección de email valido']
};
var idNuevo;
window.onload = function() {
    get_ID();
};

function campos_vacios() {

    if ($.trim($("#brandR").val()) == "" ||
        $.trim($("#procesorR").val()) == "" ||
        $.trim($("#osR").val()) == "" ||
        $.trim($("#descriptionR").val()) == "" ||
        $.trim($("#memoryR").val()) == "" ||
        $.trim($("#hardDriveR").val()) == "" ||
        $.trim($("#availabilityR").val()) == "" ||
        $.trim($("#priceR").val()) == "" ||
        $.trim($("#quantityR").val()) == "" ||
        $.trim($("#photographyR").val()) == "") {
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


function get_ID() {
    $.ajax({
        url: "http://localhost:8080/api/clone/newid",
        method: "GET",
        dataType: "JSON",
        //function(json) - funcion anonima
        success: function(response) {
            idNuevo = response;
        },
        error: function(xhr, status) {
            alert('Ha sucedido un problema, Vuelva a intentarlo más tarde ' + xhr.status);
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
                brand: $("#brandR").val(),
                procesor: $("#procesorR").val(),
                os: $("#osR").val(),
                description: $("#descriptionR").val(),
                memory: $("#memoryR").val(),
                hardDrive: $("#hardDriveR").val(),
                availability: $("#availabilityR").val(),
                price: $("#priceR").val(),
                quantity: $("#quantityR").val(),
                photography: $("#photographyR").val()
            }
            $.ajax({
                url: "http://localhost:8080/api/clone/new",
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
        url: 'http://localhost:8080/api/clone/all',
        type: 'GET',
        dataType: 'JSON',
        //function(json) - funcion anonima
        success: function(respuesta) {
            // capa div - resultado
            $("#resultado").empty();
            for (i = 0; i < respuesta.length; i++) {
                $("#resultado").append("<tr>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].brand + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].procesor + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].os + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].description + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].memory + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].hardDrive + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].availability + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].price + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
                $("#resultado").append("<td>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + respuesta[i].photography + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</td>");
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
        url: "http://localhost:8080/api/clone/" + id,
        type: 'DELETE',
        datatype: "JSON",
        success: function(repuesta) {
            $("#resultado").empty();
            consultar();
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
        brand: $("#brandR").val(),
        procesor: $("#procesorR").val(),
        os: $("#osR").val(),
        description: $("#descriptionR").val(),
        memory: $("#memoryR").val(),
        hardDrive: $("#hardDriveR").val(),
        availability: $("#availabilityR").val(),
        price: $("#priceR").val(),
        quantity: $("#quantityR").val(),
        photography: $("#photographyR").val()
    }
    let dataTosend = JSON.stringify(myData);
    if (campos == false) {
        alert("Por favor ingrese todos los campos");
    } else {
        if ($("#contrasenaRegistro").val() == $("#contrasenaRegistro2").val()) {
            $('#exampleModal').modal('hide');
            $.ajax({
                url: "http://localhost:8080/api/clone/update",
                type: "PUT",
                data: dataTosend,
                contentType: "application/JSON",
                dataType: 'JSON',
                success: function(respuesta) {
                    $("#resultado").empty();
                    $("#brandR").val("");
                    $("#procesorR").val("");
                    $("#osR").val("");
                    $("#descriptionR").val("");
                    $("#memoryR").val("");
                    $("#hardDriveR").val("");
                    $("#availabilityR").val("");
                    $("#priceR").val("");
                    $("#quantityR").val("");
                    $("#photographyR").val("");
                    console.log("update", respuesta)
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