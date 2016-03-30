//var routeListData = [];
var changeRoute;

// DOM Ready =============================================================
$(document).ready(function() {

    changeRoute = false;

    populateRouteList(true);

    // route link click
    $('#list').on('click', 'a.route-list-item', showRoute);

    $('#change-route').on('click', flipChangeRoute);
});

// Functions =============================================================

function populateRouteList(firstCall = false) {

    var listContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/routes', function( data ) {

        //routeListData = data;

        $.each(data, function(){

            listContent += '<a href="#" class="route-list-item" rel="' + this._id + '">';
            listContent += '<div class="email-item pure-g">';
            listContent += '<div class="pure-u"><p class="email-avatar" height="64" width="64">' + this.Grade.France + '</p></div>';
            listContent += '<div class="pure-u-3-4">';
            listContent += '<h5 class="email-name">';
            if(this.Location){
                listContent += this.Location.City + ', ' + this.Location.Land
            }else{
                listContent += 'Unkown location'
            }
            listContent += '</h5>';
            listContent += '<h4 class="email-subject">' + this.Name + '</h4>';
            listContent += '<p class="email-desc">';
            listContent += ((this.Outdoor) ? 'Buiten' : 'Binnen' ) + ' ';
            listContent += ((this.LeadClimbed) ? 'voorgeklommen' : 'getoproped' );
            listContent += '</p></div></div></a>';
        });

        // Inject the whole content string into our existing HTML table
        $('#list').html(listContent);

        // Set first details if requested
        if(firstCall) $('#list').find('a:first').click();
    });
};

// Show Route
function showRoute(event) {

    // Getting ready
    $('.email-content-title').text('Data word opgehaald');

    // Select requested item
    $('div.email-item').removeClass('email-item-selected email-item-unread');
    $(this).find('div.email-item').addClass('email-item-selected email-item-unread');

    // jQuery AJAX call for JSON
    $.getJSON( '/routes/' + $(this).attr('rel'), function( data ) {

        showRouteInfo(data);
        showRouteDetails(data);

    }).fail(function(err){
        $('#message').html('<div class="error"><a href="#" onclick="closeMessage()">X</a><strong>Error ' + err.status + '</strong> ' + err.responseText + '</div>');
    });
};

// Show Route Info
function showRouteInfo(data) {
    $('.email-content-title').text('Route details "' + data.Name + '"');
    $('.email-content-subtile').text('Toegevoegd op ' + data.Meta.Created);
    $('#change-route').attr('rel', data._id);
    $('#delete-route').attr('rel', data._id);
};

// Show Route Info
function showRouteDetails(data){
    if(!changeRoute){
        var content = '';
        content += '<div class="email-content-body">';         
        content += '<form action="#" class="pure-form pure-form-aligned">';
        content += '<fieldset>';
        content += '<div class="pure-control-group">';
        content += '<label for="Name">Naam</label>';
        content += '<label id="Name"></label>';
        content += '</div>';
        content += '<div class="pure-control-group">';
        content += '<label for="Grade">Niveau</label>';
        content += '<label id="Grade"></label>';
        content += '</div>';

        content += '<div class="pure-control-group">';
        content += '<label>Buiten</label>';
        content += '<div class="onoffswitch">';
        content += '<input type="checkbox" name="Outdoor" class="onoffswitch-checkbox" id="outdooronoffswitch" checklabel="' + data.Outdoor + '" ' + ((data.Outdoor) ? 'checked' : '') +'>';
        content += '<label class="onoffswitch-label" for="outdooronoffswitch"></label>';
        content += '</div>';
        content += '</div>';

        content += '<div class="pure-control-group">';
        content += '<label>Voorgeklommen</label>';
        content += '<div class="onoffswitch">';
        content += '<input type="checkbox" name="LeadClimbed" class="onoffswitch-checkbox" id="leadclimbedonoffswitch" checklabel="' + data.LeadClimbed + '" ' + ((data.LeadClimbed) ? 'checked' : '') +'>';
        content += '<label class="onoffswitch-label" for="leadclimbedonoffswitch"></label>';
        content += '</div>';
        content += '</div>';

        content += '<div class="indoors">';

        if(!data.Outdoor){

            content += '<div class="pure-control-group">';
            content += '<label for="Rope">Geklommen touw</label>';
            content += '<label id="Rope"></label>';
            content += '</div>';

            content += '<div class="pure-control-group">';
            content += '<label for="Color">Kleur</label>';
            content += '<label id="Color"></label>';
            content += '</div>';

        }

        content += '</div>';
        content += '</fieldset>';
        content += '</form>';
        content += '</div>';
        
        $('.email-content-body').html(content);

        $('#Name').text(data.Name);
        $('#Grade').text(data.Grade.France);
        $('#Rope').text(data.Rope);
        $('#Color').text(data.Color);
        ((data.Outdoor) ? $('#Outdoor').val('on'): $('#Outdoor').val(''));
        ((data.LeadClimbed) ? $('#LeadClimbed').val('on'): $('#LeadClimbed').val(''));

    }else{
        var content = '';
        content += '<div class="email-content-body">';         
        content += '<form id="add-route" action="/routes" class="pure-form pure-form-aligned">';
        content += '<fieldset>';
        content += '<div class="pure-control-group">';
        content += '<label for="Name">Naam</label>';
        content += '<input id="Name" name="Name" type="text" placeholder="La Dura Dura">';
        content += '</div>';
        content += '<div class="pure-control-group">';
        content += '<label for="Grade">Niveau</label>';
        content += '<input id="Grade" name="Grade" type="text" placeholder="6a">';
        content += '</div>';

        content += '<div class="pure-control-group">';
        content += '<label>Buiten</label>';
        content += '<div class="onoffswitch">';
        content += '<input type="checkbox" name="Outdoor" class="onoffswitch-checkbox" id="outdooronoffswitch" checklabel="' + data.Outdoor + '" ' + ((data.Outdoor) ? 'checked' : '') +'>';
        content += '<label class="onoffswitch-label" for="outdooronoffswitch"></label>';
        content += '</div>';
        content += '</div>';

        content += '<div class="pure-control-group">';
        content += '<label>Voorgeklommen</label>';
        content += '<div class="onoffswitch">';
        content += '<input type="checkbox" name="LeadClimbed" class="onoffswitch-checkbox" id="leadclimbedonoffswitch" checklabel="' + data.LeadClimbed + '" ' + ((data.LeadClimbed) ? 'checked' : '') +'>';
        content += '<label class="onoffswitch-label" for="leadclimbedonoffswitch"></label>';
        content += '</div>';
        content += '</div>';

        content += '<div class="indoors">';

        content += '<div class="pure-control-group">';
        content += '<label for="Rope">Geklommen touw *</label>';
        content += '<input id="Rope" name="Rope" type="text" placeholder="21">';
        content += '</div>';

        content += '<div class="pure-control-group">';
        content += '<label for="Color">Kleur *</label>';
        content += '<input id="Color" name="Color" type="text" placeholder="Appel groen">';
        content += '</div>';

        content += '</div>';
        content += '<div class="pure-controls">';
        content += '<label class="pure-checkbox">* Alleen voor routes binnen.</label>';

        content += '<button type="submit" class="pure-button pure-button-primary">Route aanpassen</button>';
        content += '</div>';
        content += '</fieldset>';
        content += '</form>';
        content += '</div>';
        
        $('.email-content-body').html(content);

        $('#Name').val(data.Name);
        $('#Grade').val(data.Grade.France);
        $('#Rope').val(data.Rope);
        $('#Color').val(data.Color);
        ((data.Outdoor) ? $('#Outdoor').val('on'): $('#Outdoor').val(''));
        ((data.LeadClimbed) ? $('#LeadClimbed').val('on'): $('#LeadClimbed').val(''));

        //switch
        if(data.Outdoor)
            $(".indoors").hide();

        $("#outdooronoffswitch").click(function(){
            
            $(".indoors").toggle(150);

            $(".indoors div input").val('');
            
        });

       $("input[type=checkbox]").on('click', function(){

            $(this).attr('checklabel', ($(this).attr('checklabel') == 'true' ? false : true));
        });

        $('#add-route').submit(function(){

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

            url = $form.attr('action') + '/' + $('#change-route').attr('rel');

            $.ajax({
                type: 'PUT',
                url: '/api' + url,
                data: data,
                success : function(res){
                    populateRouteList();
                    $('#message').html('<div class="success"><a href="#" onclick="closeMessage()">X</a><strong>Opgeslagen</strong> ' + res + '</div>');
                },
                error : function(err){
                    $('#message').html('<div class="error"><a href="#" onclick="closeMessage()">X</a><strong>Error ' + err.status + '</strong> ' + err.responseText + '</div>');
                }
            });
        });
    } 
}

function flipChangeRoute(){
    ((changeRoute == true) ? changeRoute = false : changeRoute = true);

    // Getting ready
    $('.email-content-title').text('Data word opgehaald');

    // Select requested item
    $('div.email-item').removeClass('email-item-selected email-item-unread');
    $(this).find('div.email-item').addClass('email-item-selected email-item-unread');

    // jQuery AJAX call for JSON
    $.getJSON( '/routes/' + $(this).attr('rel'), function( data ) {

        showRouteInfo(data);
        showRouteDetails(data);

    }).fail(function(err){
        $('#message').html('<div class="error"><a href="#" onclick="closeMessage()">X</a><strong>Error ' + err.status + '</strong> ' + err.responseText + '</div>');
    });
}