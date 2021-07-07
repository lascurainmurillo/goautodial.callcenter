var agentinfo = {}

/**
 * 
 * 
 * Ejecutar algunos plugin sobre los inputs del fourmario personalizado de goautodial
 */
agentinfo.execinput_formcustom = function() {
    $('#custom_credit_card_information').mask("9999 9999 9999 9999");
    $('#custom_exp_date').mask("9999");
    $('#custom_cvc_code').mask("9999");
}