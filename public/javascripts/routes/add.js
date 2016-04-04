// DOM Ready =============================================================
$(document).ready(function() {

    $('#add-route').submit(addRoute);

});

// Functions =============================================================

function addRoute(event) {
        
    event.preventDefault();

    var $form = $(this);
    var data = {
        Name: $form.find("input[name='Name']").val(),
        Grade: $form.find("input[name='Grade']").val(),
        Outdoor: $form.find("input[name='Outdoor']").attr('checklabel'),
        LeadClimbed: $form.find("input[name='LeadClimbed']").attr('checklabel'),
        Rope: $form.find("input[name='Rope']").val(),
        Color: $form.find("input[name='Color']").val()
    };

    url = $form.attr('action');

    $.post('/api'+url, data)
        .success(function(res){
            $('#Name').val('');
            $('#Grade').val('');
            $('#Rope').val('');
            $('#Color').val('');
            $('#message').html('<div class="success"><a href="#" onclick="closeMessage()">X</a><strong>Geslaagd</strong> ' + res + '</div>');
        })
        .fail(function(err){
            $('#message').html('<div class="error"><a href="#" onclick="closeMessage()">X</a><strong>Error ' + err.status + '</strong> ' + err.responseText + '</div>');
        })
};