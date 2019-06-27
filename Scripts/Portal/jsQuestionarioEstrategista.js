$(document).ready(function () {

    $('#okParametrizacao').click(function () {

        var url = '/QuestionarioEstrategista/TrocaFase';

        $.ajax({
            url: url,
            type: 'POST',
            data: 1,
            contentType: false,
            processData: false,
            success: function (data) {
                swal("Salvo!", "Fase alterada com sucesso!!!", "success"
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
                                $('.close').click();
                                window.location.href = data.redirectUrl;
                                return false;
                                break;
                        }
                    });
            },
            error: function (data) {
                swal("Erro!", data, "error");
            }
        });

        return false;
    });
    $('#frmQuestionarioEstrategista').submit(function () {
        if (!ValidarCampos()) {

            return false;
        }

        var model = new FormData(this);

        var url = '/QuestionarioEstrategista/CadastrarEditar';

        $.ajax({
            url: url,
            type: 'POST',
            data: model,
            contentType: false,
            processData: false,
            success: function (data) {
                swal("Salvo!!!", "Registro salvo com sucesso!!!", "success"
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
                                $('.close').click();
                                window.location.href = data.redirectUrl;
                                return false;
                                break;
                        }
                    });
            },
            error: function (data) {
                swal("Erro!", data, "error");
            }
        });

        return false;
    });
    $('.recusarAlert').click(function () {

        VoltaParametrizacao();
    });
    $('#btnInicioTratamento').click(function () {

        SetInicioTratamento();

    });
    $('#btnPrametrizacaoOk').click(function () {

        AltereEtapa(1);

    });
    $('#btnInicioTratamento').click(function () {

        VoltaParametrizacao();

    });

    $('.js-switch').each(function () {
        new Switchery($(this)[0], $(this).data());
    });

    $('#idParagrafoPossuiTreinamento').click(function () {
        const container = document.querySelector('.cardTreinamento');
        toggleFormDiv(container);
        $(".cardTreinamento").attr("disabled", "disabled").off('click');

    });


    //*************** Primeira leitura de código é obrigatório INI ***************
    //const container = document.querySelector('.cardTreinamento');
    //toggleFormDiv(container);
    $(".cardTreinamento").addClass("disabled");


    //*************** Primeira leitura de código é obrigatório FIM ***************
    $('.deleteAlert').click(function () {
        Delete('O questionário será excluído. Deseja Continuar?', "Questionário excluído com sucesso!", "Questionário não foi excuído!", $(this));
    });

});

// Helper function to change disabled state of single element
function changeDisabledState(elm, disabled) {
    if (!disabled) {
        elm.removeAttribute('disabled');
    }
    else {
        elm.setAttribute('disabled', disabled);
    }
}
$(window).bind("load", function () {
    //se for inclusão
    if ($('#IdQuestionarioEstrategista').val() == 0) {
        ConfiguraTelaInclusao();
    }
    else {
        ConfiguraTelaEdicao();
    }
});
function toggleFormDiv(container) {
    $("#erroPontoFocalTreinamento").css("display", "none");
    // Check if helper class is there
    const isDisabled = container.classList.contains('disabled');

    // Query all fields inside DIV.
    const allFields = container.querySelectorAll('input, textarea, button, select, div');

    // Iterate over all elements and set the opposite state
    [...allFields].forEach(elm => {
        changeDisabledState(elm, !isDisabled);
    });

    // Toggle helper class
    container.classList.toggle('disabled');
}
function ValidarCampos() {

    var bValido = true;
    var fp = $("#file");
    var lg = fp[0].files.length;

    var txtArea = $("#Descricao").val();
    txtArea = txtArea.replace("<br>", '');

    if ($("#NomeQuestionario").val().trim() == "") {
        $("#erroNomeQuestionario").css("display", "block");
        bValido = false;
    }
    else {
        $("#erroNomeQuestionario").css("display", "none");
    }

    if (txtArea == "") {
        $("#erroDescricaoQuestionario").css("display", "block");
        bValido = false;
    }
    else {
        $("#erroDescricaoQuestionario").css("display", "none");
    }

    if (lg < 4 && $("listaArquivos").length == 0) {
        $("#erroSpanArquivo").css("display", "block");
        bValido = false;
    }
    else if ($("listaArquivos").length > 0) {
        if ($('#listaArquivos tr').length < 4) {
            $("#erroListArquivo").css("display", "block");
            bValido = false;
        }
        else {
            $("#erroListArquivo").css("display", "none");
        }
    }
    else {
        $("#erroSpanArquivo").css("display", "none");
    }
    bValido = ValidaCombos(bValido);
    return bValido;
}
function OnSuccess(data) {
    swal({
        title: "Salvo!",
        text: "Priorização salva com sucesso!",
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
        });
}
function OnFailure(data) {
    swal({
        title: "Erro!",
        text: "Erro ao salvar priorização!",
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
    var id = linhaDeletada.closest('tr').attr('id');

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
                    var serviceURL = '/QuestionarioEstrategista/Excluir';

                    $.ajax({
                        type: "POST",
                        url: serviceURL,
                        contentType: "application/json; charset=utf-8",
                        data: "{id:" + id + "}",
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
function OnSuccessCadQuestionario(data) {
    swal({
        title: "Salvo!",
        text: "Questionário salvo com sucesso!",
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
        });
}
function OnFailureCadQuestionario(data) {
    swal({
        title: "Erro!",
        text: "Erro ao salvar o Questionário!",
        icon: "error",
        buttons: {
            continuar: {
                text: "Continuar",
                value: "continuar",
            }
        },
    });
}
function ValidaCombos(bValido) {
    var a = document.getElementById("IdResponsavelParametrizacao");
    var b = document.getElementById("IdResponsavelHomologacao");
    var c = document.getElementById("IdResponsavelTreinamento");
    var d = document.getElementById("IdResponsavelImplantacao");
    var e = document.getElementById("IdCarteira");
    var f = document.getElementById("IdAssunto");

    if (a.options[a.selectedIndex].text == "Selecione") {
        $("#erroPontoFocalParametrizacao").css("display", "block");
        bValido = false;
    }
    else {
        $("#erroPontoFocalParametrizacao").css("display", "none");
    }
    //--------------------------------------------------------------------
    if (b.options[b.selectedIndex].text == "Selecione") {
        $("#erroPontoFocalHomologacao").css("display", "block");
        bValido = false;
    }
    else {
        $("#erroPontoFocalHomologacao").css("display", "none");
    }
    //--------------------------------------------------------------------
    if (c.options[c.selectedIndex].text == "Selecione" && $('#NecessarioTreinamento').is(':checked')) {
        $("#erroPontoFocalTreinamento").css("display", "block");
        bValido = false;
    }
    else {
        $("#erroPontoFocalTreinamento").css("display", "none");
    }
    //--------------------------------------------------------------------
    if (d.options[d.selectedIndex].text == "Selecione") {
        $("#erroPontoFocalImplantacao").css("display", "block");
        bValido = false;
    }
    else {
        $("#erroPontoFocalImplantacao").css("display", "none");
    }
    //--------------------------------------------------------------------
    if (e.options[e.selectedIndex].text == "Selecione") {
        $("#erroCarteira").css("display", "block");
        bValido = false;
    }
    else {
        $("#erroCarteira").css("display", "none");
    }
    //--------------------------------------------------------------------
    if (f.options[f.selectedIndex].text == "Selecione") {
        $("#erroAssunto").css("display", "block");
        bValido = false;
    }
    else {
        $("#erroAssunto").css("display", "none");
    }
    //--------------------------------------------------------------------
    return bValido;
}
function ConfiguraTelaInclusao() {

    const container = document.querySelector('#btnInicioTratamento')
    container.classList.toggle('disabled');

    const container2 = document.querySelector('#btnPrametrizacaoOk');
    container2.classList.toggle('disabled');

    const container3 = document.querySelector('#btnRecusarHomolog');
    container3.classList.toggle('disabled');

    const container4 = document.querySelector('#btnHomologacaoOk');
    container4.classList.toggle('disabled');

    const container5 = document.querySelector('#btnTreinamentoOk');
    container5.classList.toggle('disabled');

    const container6 = document.querySelector('#btnImplantacaoOk');
    container6.classList.toggle('disabled');
}
function ConfiguraTelaEdicao() {
    var etapa = $('#IdQuestionarioEtapa').val();
    var usuarioLogado = $('#IdUsuarioLogado').val();
    var dataAbertura = $('#DataAbertura').val();


    $(".cardParametrizacao").addClass("disabled");
    $(".cardHomologacao").addClass("disabled");
    $(".cardImplantacao").addClass("disabled");

    if ((etapa == 1 || etapa == 5) && usuarioLogado == $('#IdResponsavelParametrizacao').val()) {
        $(".cardParametrizacao").removeClass("disabled");
        if (dataAbertura != "Não Iniciado") {
            const container = document.querySelector('#btnInicioTratamento')
            container.classList.toggle('disabled');

        }
        
    }
    else if ((etapa == 2) && usuarioLogado == $('#IdResponsavelHomologacao').val()) {
        $(".cardHomologacao").removeClass("disabled");
     
    }
    else if ((etapa == 3) && usuarioLogado == $('#IdResponsavelTreinamento').val()) {
        $(".cardTreinamento").removeClass("disabled");
    }
    else if ((etapa == 4) && usuarioLogado == $('#IdResponsavelImplantacao').val()) {
        $(".cardImplantacao").removeClass("disabled");
    }
    else {
       
    }
}
function SetInicioTratamento() {

    var url = '/QuestionarioEstrategista/SetInicioTratamento';

    var IdQuest = $('#IdQuestionarioEstrategista').val();
    var IdEtap = $('#IdQuestionarioEtapa').val();

    $.ajax({
        url: url,
        type: 'POST',
        data: { IdQuestionario: IdQuest, IdEtapa: IdEtap },
        dataType: 'json',
        success: function (data) {
            swal("Etapa Iniciada!", "Etapa de parametrização iniciada com sucesso!", "success"
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
                            $('.close').click();
                            window.location.href = data.redirectUrl;
                            return false;
                            break;
                    }
                });
        },
        error: function (data) {
            swal("Erro!", data, "error");
        }
    });

    return false;
}
function AltereEtapa(idEtapa) {

    var url = '/QuestionarioEstrategista/AlteraEtapa';
    var IdQuest = $('#IdQuestionarioEstrategista').val();
    var IdEtap = $('#IdQuestionarioEtapa').val();


    $.ajax({
        url: url,
        type: 'POST',
        data: { IdQuestionario: IdQuest, IdEtapa: IdEtap },
        dataType: 'json',
        success: function (data) {
            swal("Etapa Alterada!", "Etapa finalizada com sucesso, todos os envolvidos foram avisados!", "success"
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
                            $('.close').click();
                            window.location.href = data.redirectUrl;
                            return false;
                            break;
                    }
                });
        },
        error: function (data) {
            swal("Erro!", data, "error");
        }
    });

    return false;
}
function VoltaParametrizacao() {

    var url = '/QuestionarioEstrategista/VoltaParametrizacao';
    var IdQuest = $('#IdQuestionarioEstrategista').val();
    var IdEtap = $('#IdQuestionarioEtapa').val();


    $.ajax({
        url: url,
        type: 'POST',
        data: { IdQuestionario: IdQuest, IdEtapa: IdEtap },
        dataType: 'json',
        success: function (data) {
            swal("Etapa Recusada!", "A etapa foi alterada para paremetrização, todos os envolvidos foram avisados!", "success"
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
                            $('.close').click();
                            window.location.href = data.redirectUrl;
                            return false;
                            break;
                    }
                });
        },
        error: function (data) {
            swal("Erro!", data, "error");
        }
    });

    return false;
}