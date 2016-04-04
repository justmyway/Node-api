// DOM Ready =============================================================
$(document).ready(function() {

    //exit message
    $('#message div a.close').on('click', closeMessage);

    $("input[type=checkbox]").on('click', setValue);

    //switch
    $(".indoors").hide();

    $("#outdooronoffswitch").click(function(){
        
        $(".indoors").toggle(150);

        $(".indoors div input").val('');
        
    });

});

// Functions =============================================================

function closeMessage(event) {

    $('#message').html('');

};

function setValue(event){

	$(this).attr('checklabel', ($(this).attr('checklabel') == 'true' ? false : true));
};