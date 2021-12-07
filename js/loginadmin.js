var validations = {
    email: [/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/, 'Por favor ingrese una dirección de email valido']
};

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
            url: "http://localhost:8080/api/user/" + datos.email + "/" + datos.password,
            method: "GET",
            dataType: "json",
            success: function(response) {
                if (response.password == null) {
                    alert("Los datos ingresados no existen en la base de datos, recuerda realizar el registro")
                } else if (response.password == datos.password) {
                    alert("Contraseña Incorrecta")
                } else {
                    if (response.type == "ADM") {
                        console.log(response);
                        window.location.href = "administrador.html";
                    }
                }
            },
            error: function(xhr, status) {
                console.log(xhr);
                console.log(status);
            }
        });
    }
});