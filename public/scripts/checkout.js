Stripe.setPublishableKey('pk_test_51Od966GbDUdT8ZzpfRAgDt1io0zcVmZiCMZxdWTgulE4vVbn0C89piInoPOmO9bulA2tPLdyAl8Qp4tW2vT50jmN00DSsYzTKg')

var $form = $('#checkout-form');
$form.submit(function(event) {
    $('#charge-error').addClass('hidden')
    $form.find('button').prop('disabled', true);

    Stripe.card.createToken({
        number: $('.cardNumber').val(),
        exp_month: $('.cardExpirationMonth').val(),
        exp_year: $('.cardExpirationYear').val(),
        cvc: $('.cvc').val()
    }, stripeResponseHandler);

    return false;
});

function stripeResponseHandler(status, response) {
    if (response.error) {

        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden')
        $form.find('button').prop('disabled', false);
    }
    else {
        var token = response.id;

        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        $form.get(0).submit();  
    }
     


     
}