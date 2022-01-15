<?php
// Archivo .php de extension del module.php

// Clientes potenciales

class moduleCustom {
    
    /**
     * modalClientLeads
     * Modal para mostrar la lista de leads registrados
     * @param object $goDB
     * @return string (html)
     */
    public static function modalClientLeads($goDB) {
                
        $goDB->where('type', 'leadgen');
        $goDB->where('status', 1);
        $result = $goDB->orderBy('created_time', 'DESC')->get('go_social_webhook_data', null, 'id,full_name,email,phone_number,created_time');

        $html_result_leadgen = "";
        foreach ($result as $key => $value) {

            $fecha = date_create($value['created_time']);
            $fecha1 = date_format($fecha, 'd-M-Y');
            $fecha2 = explode('-', $fecha1);

            $html_result_leadgen .= "
                <tr>
                    <th>
                        ".$value['full_name']."
                    </th>
                    <th>
                        ".$value['email']."
                    </th>
                    <th>
                        ".$value['phone_number']."
                    </th>
                    <th>
                        <span class='dropdown-time text-primary' xtime='".date('r', strtotime($value['created_time']))."'></span>
                        <span class='dropdown-time text-primary'>".$fecha2[0] . " " . $fecha2[1] . " " . $fecha2[2]."</span>
                    </th>
                    <th>
                        <button class=\"btn btn-warning\">Accion 1</button>
                        <!-- button class=\"btn btn-danger\">Ocultar</button> -->
                    </th>
                </tr>
            ";
        }


        $modal = '
                <div id="modal-client-leads" class="modal fade" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h4 class="modal-title">Clientes potenciales</h4>
                            </div>
                            <div class="modal-body">
                                <div class="table-responsive">
                                    <table id="list_leadgen" class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Telefono</th>
                                                <th>T. Espera</th>
                                                <th>
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody> 
                                            '.$html_result_leadgen.'
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="modal-footer">

                            </div>
                        </div>
                    </div>
                </div>
        ';

    
        return $modal;
    
    }
    
    /**
     * javascriptAll
     * javacript para agentes
     * @param  object $db
     * @return string (script)
     */
    public static function javascriptAll($db) {
        
        $script = "
        <script>

            function openModalCientLeads() {

                $.ajax({
                    url: './php/social_red/SocialWebhookViewStatus.php',
                    type: 'POST',
                    dataType: 'json',
                    data: { responsetype: 'json', utjo: getCookie('utjo') },
                    success: function(data) {
            
                        if (data.result == 'success') {
                            $('#viewcount').html(0);
                        } else {
                            // colocar un swal para notificar que el usuario no se logeo correctamente
                            swal('Cerrar', data.result, 'error');
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        swal('Cerrar', 'Sucedió un problema inténtelo nuevamente. ' + errorThrown, 'error');
                    }
                });


                $('#modal-client-leads').modal({
                    // keyboard: false,
                    // backdrop: 'static',
                    // show: true
                });
                
            }
        
        </script>

        ";

        return $script;

    }

}
?>