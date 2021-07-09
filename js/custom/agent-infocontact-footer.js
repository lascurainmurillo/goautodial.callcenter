var agentinfo = {}

/**
 * 
 * Ejecutar algunos plugin sobre los inputs del fourmario personalizado de goautodial
 */
agentinfo.execinput_formcustom = function() {
    $('#custom_credit_card_information').mask("9999 9999 9999 9999");
    $('#custom_exp_date').mask("9999");
    $('#custom_cvc_code').mask("9999");
}

agentinfo.addpackage = function() {

    var bodyPackages = $("#body-packages"); // body de la tabla de packages de formulario personalizado Lead 1004 packages_booking

    var filepackage = agent.templatetbody(null, null, null, null);

    bodyPackages.append(filepackage);

}

agentinfo.delpackage = function(e) {
    $(e).parents('tr').remove();
}

agentinfo.renderrow = function(packages) {

    var bodyPackages = $("#body-packages"); // body de la tabla de packages de formulario personalizado Lead 1004 packages_booking

    var html = "";
    packages.forEach(el => {  

        html += agent.templatetbody(el.hotel, el.days, el.destination, el.validity);

    });

    bodyPackages.html(html);
    agentinfo.addpackage();

}

/** ----------- TEMPLATE -------------------------------------------------------------------------------------------------------------- */
agent.templatetbody = function(hotel, days, destination, validity) {
    return `<tr>
                <td><input type="text" class="form-control" nom="hotel" placeholder="Hotel" name="hotel[]" ${(hotel != null) ? 'value="'+hotel+'"' : 'value=""'} ></td>
                <td><input type="text" class="form-control" nom="days" placeholder="Days" name="days[]" ${(days != null) ? 'value="'+days+'"' : 'value=""'}></td>
                <td><input type="text" class="form-control" nom="destination" placeholder="Destination" name="destination[]" ${(destination != null) ? 'value="'+destination+'"' : 'value=""'} ></td>
                <td><input type="text" class="form-control" nom="validity" placeholder="Validity" name="validity[]" ${(validity != null) ? 'value="'+validity+'"' : 'value=""'} ></td>
                <td>
                    <button id="btn-delpackage" type="button" class="btn btn-danger" onclick="agentinfo.delpackage(this)">
                        <i class="fa fa-times-circle" aria-hidden="true"></i>
                    </button>
                </td>
            </tr>`;
}