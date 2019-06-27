$(document).ready(function () {

    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

    $('.js-switch').each(function () {
        new Switchery($(this)[0], $(this).data());
    });

    verifyCheckAll("checkUser", "checkAllUser");

    $('#btnSave').click(function () {
        SalvaComentario('O comentário será postado deseja continuar?', "Comentário postado com sucesso!", "O comentário não foi postado!", $(this));
    });

    $(".checkUser").click(function () {
        if ($(this).is(":checked")) {
            verifyCheckAll("checkUser", "checkAllUser");
        }
        else {
            $("#checkAllUser").prop("checked", false);
        }
    });

    $("#checkAllUser").click(function () {
        $('.checkUser').not(this).prop('checked', this.checked);
    });

    $("#IdNivelCompartilhamento").change(function () {
        if ($("#IdNivelCompartilhamento").val() == "1") {
            $("#divGerenciasFormGroup").css("display", "none");
            $("#erroSpanGerencia").css("display", "none");
        }
        else {
            $("#divGerenciasFormGroup").css("display", "block");
        }
    });

    $('.deleteAlert').click(function () {
        Delete('O post será excluído. Deseja Continuar?', "Post excluído com sucesso!", "Post não foi excuído!", $(this));
    });

    $("#IdNivelCompartilhamento").change();
});



function ValidarCampos() {
    //var aaaaa = $('input[type=checkbox]').attr('checked');
    //var bbbbb = $('#Terceiros').prop('checked');
    var bValido = true;

    var txtArea = $("#txtArea").val();
    txtArea = txtArea.replace("<br>", '');

    if ($("#Titulo").val().trim() == "") {
        $("#erroSpanTitulo").css("display", "block");
        bValido = false;
    }
    else {
        $("#erroSpanTitulo").css("display", "none");
    }

    if (txtArea == "") {
        $("#erroSpanDescricao").css("display", "block");
        bValido = false;
    }
    else {
        $("#erroSpanDescricao").css("display", "none");
    }

    if ($("#IdNivelCompartilhamento").val() != "1") {
        var iCountSelecionado = 0;

        $(".checkUser").each(function () {
            if ($(this)[0].checked) {
                iCountSelecionado++;
            }
        });

        if (iCountSelecionado == 0) {
            $("#erroSpanGerencia").css("display", "block");
            bValido = false;
        }
        else {
            $("#erroSpanGerencia").css("display", "none");
        }
    }
    else {
        $("#erroSpanGerencia").css("display", "none");
    }

    return bValido;
}
function SalvaComentario(msgPergunta, msgSucesso, msgFalha,) {

    var comentario = {
        IdPost: $('#IdPost').val(),
        Descricao: $('#comentarioPost').val(),
        IdUsuarioComentario: $('#IdUsuarioCriacao').val()
    };

    swal(msgPergunta, {

        buttons: {
            cancelar: {
                text: "Cancelar",
                value: "cancelar",
            },
            continuar: {
                text: "Continuar",
                value: "continuar",
                dangerMode: true,
            }
        },

    })
    .then((value) => {
        switch (value) {

            case "cancelar":
                return false;
                break;

            case "continuar":
                var serviceURL = '/Posts/CadastrarComentario';
                console.log(JSON.stringify(comentario));
                $.ajax({
                    type: "POST",
                    url: serviceURL,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(comentario),
                    dataType: "json",
                    success: function (data) {
                        if (data.msg == 'success') {
                         
                            swal("Postado!", msgSucesso, "success");
                            location.reload();
                        }
                        else {
                            swal("Erro!", msgFalha, "error");
                        }
                    },
                    error: function () {
                        alert('Error occured');
                    }
                });
                break;
        }
    });



}
function AtualizaComentarios()
{
    var $div = $('#divComentarios');

    var idPost = $('#IdPost').val();
    alert(idPost);
    var timer = setInterval(function () {
        var serviceURL = '/Posts/Visualizar';

        $.ajax({
            type: "POST",
            url: serviceURL,
            contentType: "application/json; charset=utf-8",
            data: "{id:" + idPost + "}",
            dataType: "json",
            success: function (data) {

                data = JSON.parse(data);
                    $div.html('<li>' +
                            + '<a class="pull-left" href="javascript:;"><img class="todo-userpic" src="~/Content/assets/images/users/reinaldo.bmp" width="27px" height="27px"></a>'
                            + '<div class="media-body todo-comment">'
                            + '<p class="todo-comment-head">'
                            + '<span class="todo-comment-username">'+ data.NomeUsuarioComentario + '</span> &nbsp;'
                            + '<span class="todo-comment-date">' + data.DataInclusao + '</span>'
                            + '</p>'
                            + '<p class="todo-text-color">' + data.Descricao +'</p>'
                            + '</div>'
                            + '</li>'
                    );
              
            },
            error: function () {
                swal("Erro!", "", "error");
            }
        });
        timer;
        

        // which would reference some dynamic content 
    }, 9000);
}
function ValidarCamposcomentarios() {
    //var aaaaa = $('input[type=checkbox]').attr('checked');
    //var bbbbb = $('#Terceiros').prop('checked');
    var bValido = true;

    var txtArea = $("#comentarioPost").val();
    txtArea = txtArea.replace("<br>", '');

    if (txtArea == "") {
        $("#erroSpanDescricao").css("display", "block");
        bValido = false;
    }
    else {
        $("#erroSpanDescricao").css("display", "none");
    }
    return bValido;
}
function OnSuccess(data) {
    swal({
        title: "Salvo!",
        text: "Registro salvo com sucesso!",
        icon: "success",
        buttons: {
            continuar: {
                text: "Continuar",
                value: "continuar",
            }
        },
    })
        .then(() => {
            window.location.href = data.redirectUrl;
            //window.location.href = data.redirectUrl;
        });
}
function OnFailure(data) {
    swal({
        title: "Erro!",
        text: "Erro ao salvar registro!",
        icon: "error",
        buttons: {
            continuar: {
                text: "Continuar",
                value: "continuar",
            }
        },
    });
}
function Delete(msgPergunta, msgSucesso, msgFalha, linhaDeletada) {
    var idPost = linhaDeletada.closest('tr').attr('id');
    swal(msgPergunta, {
        buttons: {
            cancelar: {
                text: "Cancelar",
                value: "cancelar",
            },
            continuar: {
                text: "Continuar",
                value: "continuar",
                dangerMode: true,
            }
        },
    })
        .then((value) => {
            switch (value) {

                case "cancelar":
                    return false;
                    break;

                case "continuar":
                    var serviceURL = '/Posts/Excluir';

                    $.ajax({
                        type: "POST",
                        url: serviceURL,
                        contentType: "application/json; charset=utf-8",
                        data: "{id:" + idPost + "}",
                        dataType: "json",
                        success: function (data) {
                            if (data.msg == 'success') {
                                linhaDeletada.closest('tr').remove();
                                swal("Excluído!", msgSucesso, "success");
                            }
                            else {
                                swal("Erro!", msgFalha, "error");
                            }
                        },
                        error: function () {
                            alert('Error occured');
                        }
                    });
                    break;
            }
        });
}
function verifyCheckAll(nameClassItem, objCheckAll) {
    var isAllChecked = 0;
    $("." + nameClassItem.replace(".", "")).each(function () {
        if (!this.checked)
            isAllChecked = 1;
    })
    if (isAllChecked == 0) {
        $("#" + objCheckAll.replace("#", "")).prop("checked", true);
    }
}

bkLib.onDomLoaded(function () {
    new nicEditor({ fullPanel: true }).panelInstance('txtArea');
});