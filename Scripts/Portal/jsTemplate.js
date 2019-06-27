$(document).ready(function () {
    $(function () {
        $(".anchorAdicionar").click(function () {
            var id = $(this).attr("data-id");
            var url = $("#divModal").data("url");

            $.ajax({
                type: "POST",
                url: url,
                data: { idTemplateCategoria: id },
                dataType: "html",
                success: function (data) {
                    $("#divModal").html(data);
                    $("#divModal").modal("show");
                },
                error: function (data) {
                    alert(data);
                }
            });
        })
    });

    $(function () {
        $(".anchorEditar").click(function () {
            var id = $(this).attr("data-id");
            var url = $("#divModal").data("url");

            $.ajax({
                type: "POST",
                url: url,
                data: { idTemplateDocumento: id },
                dataType: "html",
                success: function (data) {
                    $("#divModal").html(data);
                    $("#divModal").modal("show");
                },
                error: function (data) {
                    alert(data);
                }
            });
        })
    });

    $(function () {
        $(".anchorExcluir").click(function () {
            var id = $(this).attr("data-id");
            
            Delete('O arquivo será excluído. Deseja Continuar?', "Arquivo excluído com sucesso!", "Arquivo não foi excuído!", id);
        })
    });
});

function Delete(msgPergunta, msgSucesso, msgFalha, id) {
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
                var serviceURL = '/Template/Excluir';

                $.ajax({
                    type: "POST",
                    url: serviceURL,
                    contentType: "application/json; charset=utf-8",
                    data: "{idTemplateDocumento:" + id + "}",
                    dataType: "json",
                    success: function (data) {
                        if (data.msg == 'success') {
                            swal("Excluído!", "Registro excluído com sucesso!!!", "success"
                                , {
                                    buttons: {
                                        ok: {
                                            text: "OK",
                                            value: "ok",
                                            dangerMode: true,
                                        }
                                    },
                                }
                            )
                            .then((value) => {
                                switch (value) {
                                    case "ok":
                                        window.location.href = data.redirectUrl;
                                        break;
                                }
                            });
                        }
                        else {
                            swal("Erro!", msgFalha, "error");
                        }
                    },
                    error: function (data) {
                        swal("Erro!", data, "error");
                    }
                });
                break;
        }
    });
}