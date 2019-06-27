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

    $('#myTable').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
  
    $('.perfilUser').change(function () {
        
        var selectedperfilUser = $(this).children("option:selected").val();
        $('input[id="IdPerfil"]').val(selectedperfilUser);
       
    });
    $('.perfilArea').change(function () {
       
        var selectedperfiArea = $(this).children("option:selected").val();
        $('input[id="IdArea"]').val(selectedperfiArea);

    });
    $('.deleteAlert').click(function () {
        DeletaUsuario('O usuário será excluído. Deseja Continuar?', "Usúario excluído com sucesso!", "Usuário não foi excuído!", $(this));
    });
});



function DeletaUsuario(msgPergunta, msgSucesso, msgFalha, linhaDeletada) {

    var idUsuario = linhaDeletada.closest('tr').attr('id');
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
                var serviceURL = '/Usuario/DeleteUsuario';
             
                $.ajax({
                    type: "POST",
                    url: serviceURL,
                    contentType: "application/json; charset=utf-8",
                    data: "{id:" + idUsuario + "}",
                    dataType: "json",
                    success: function (data) {
                        if (data.msg == 'success') {
                            linhaDeletada.closest('tr').remove();
                            swal("Excluído!", msgSucesso, "success");
                        }
                        else
                        {
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