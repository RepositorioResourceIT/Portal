﻿
$(document).ready(function () {
    $('#myTable').DataTable();
    $(document).ready(function () {
        var table = $('#example').DataTable({
            "columnDefs": [{
                "visible": false,
                "targets": 2
            }],
            "order": [
                [2, 'asc']
            ],
            "displayLength": 25,
            "drawCallback": function (settings) {
                var api = this.api();
                var rows = api.rows({
                    page: 'current'
                }).nodes();
                var last = null;
                api.column(2, {
                    page: 'current'
                }).data().each(function (group, i) {
                    if (last !== group) {
                        $(rows).eq(i).before('<tr class="group"><td colspan="5">' + group + '</td></tr>');
                        last = group;
                    }
                });
            }
        });
        // Order by the grouping
        $('#example tbody').on('click', 'tr.group', function () {
            var currentOrder = table.order()[0];
            if (currentOrder[0] === 2 && currentOrder[1] === 'asc') {
                table.order([2, 'desc']).draw();
            } else {
                table.order([2, 'asc']).draw();
            }
        });
    });
    $('.deleteAlert').click(function () {
        DeletaParametro('O parâmetro será excluído. Deseja Continuar?', "Parâmetro excluído com sucesso!", "Parâmetro não foi excuído!", $(this));
    });
});

$('#example23').DataTable({
    dom: 'Bfrtip',
    buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
    ]
});


function DeletaParametro(msgPergunta, msgSucesso, msgFalha, linhaDeletada) {

    var id = linhaDeletada.closest('tr').attr('Id');
    console.log(id);
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
                    var serviceURL = '/Parametro/Delete';

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