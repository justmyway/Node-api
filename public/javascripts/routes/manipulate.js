// DOM Ready =============================================================
$(document).ready(function() {

    $('#delete-route').on('click', deleteRoute);

});

// Functions =============================================================

function deleteRoute(event) {
        
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Weet je zeker dat je deze route wil verwijderen?');

    if(confirmation === true){
        $.ajax({
            type: 'DELETE',
            url: 'api/routes/' + $(this).attr('rel'),
            contentType: 'application/json',
            success : function(e) {
                $('#message').html('<div class="success"><a href="#" onclick="closeMessage()">X</a><strong>Verwijderd</strong> de route is verwijderd.</div>');
                
                // Getting ready
                $('.email-content-title').text('Data word opgehaald');
                $('.email-content-body').html('');
                populateRouteList(true);
            },
            error : function(err) {
                $('#message').html('<div class="error"><a href="#" onclick="closeMessage()">X</a><strong>Error ' + err.status + '</strong> ' + err.responseText + '</div>');
            }
        });
    }else{
        return false;
    }
};