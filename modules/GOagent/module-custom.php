<?php
// Archivo .php de extension del module.php

// Clientes potenciales

class moduleCustom {

    public static function modalClientLeads($goDB) {
                
        $goDB->where('type', 'leadgen');
        $goDB->where('status', 1);
        $result = $goDB->get('go_social_webhook_data', null, 'id,full_name,email,phone_number,created_time');

        $html_result_leadgen = "";
        foreach ($result as $key => $value) {

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
                    </th>
                    <th>
                        <button class=\"btn btn-warning\">Llamar a cliente</button>
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
                                    <table class="table table-striped">
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

    public static function javascriptAll($db) {
        
        $script = "
        <script>

            function openModalCientLeads() {
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