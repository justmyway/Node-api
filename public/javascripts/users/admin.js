// DOM Ready =============================================================
$(document).ready(function() {

    //set message
    setMessage('Moment geduld', 'de gebruiks worden opgehaald');

    populateUserList();

    $('#user-list-title').hover(populateUserList);
});

// Functions =============================================================

function setMessage(head, text, succes = true){
    if(succes){
        $('#message').html('<div class="success"><a href="#" onclick="closeMessage()">X</a><strong>' + head + ' </strong> ' + text + '</div>');
    }else{
        $('#message').html('<div class="error"><a href="#" onclick="closeMessage()">X</a><strong>Error ' + head + ' </strong> ' + text + '</div>');
    }
}

function populateUserList() {

    var listContent = '<table><tbody>';
    listContent += '<tr>';
    listContent += '<th>Gebruikersnaam</th>';
    listContent += '<th>Naam</th>';
    listContent += '<th>Email</th>';
    listContent += '<th>Geregistreerd</th>';
    listContent += '<th>User rechten</th>';
    listContent += '<th>Admin rechten</th>';
    listContent += '<th>Facebook</th>';
    listContent += '<th>Google</th>';
    listContent += '<th>Aanpassen</th>';
    listContent += '<th>Verwijderen</th>';
    listContent += '</tr>';

    // jQuery AJAX call for JSON
    $.getJSON( '/users', function( data ) {

        $.each(data, function(){

            var d = new Date(this.Meta.Created);
            var month = '' + (d.getMonth() + 1);
            var day = '' + d.getDate();
            var year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            var dateString = [day, month, year].join('-');

            listContent += '<tr rel="' + this._id + '">';
            listContent += '<td><input type="text" name="Username" value="' + this.Username + '"></td>';
            listContent += '<td><input type="text" name="Name" value="' + this.Name + '"></td>';
            listContent += '<td><input type="email" name="Email" value="' + this.Email + '"></td>';
            listContent += '<td><p>' + dateString + '</p></td>';
            if(this.Roles.indexOf('user') > -1){
                listContent += '<td><input name="User" type="checkbox" checked></td>';
            }else{
                listContent += '<td><input name="User" type="checkbox"></td>';
            }
             if(this.Roles.indexOf('admin') > -1){
                listContent += '<td><input name="Admin" type="checkbox" checked></td>';
            }else{
                listContent += '<td><input name="Admin" type="checkbox"></td>';
            }
            if(this.Facebook){
                listContent += '<td><input name="Facebook" type="checkbox" checked></td>';
            }else{
                listContent += '<td><input name="Facebook" type="checkbox"></td>';
            }
            if(this.Google){
                listContent += '<td><input name="Google" type="checkbox" checked></td>';
            }else{
                listContent += '<td><input name="Google" type="checkbox"></td>';
            }

            listContent += '<td><button onclick="changeUser(\'' + this._id + '\')" class="pure-button pure-button-primary">Aanpassen</button></td>';
            listContent += '<td><button onclick="removeUser(this)" rel="' + this._id + '" class="pure-button pure-button-red">Verwijderen</button></td>';
            listContent += '</tr>';
        });

        listContent += '</tbody></table>';

        $('#user-list').html(listContent);
        $('#message div a').click();
    });
};

function removeUser(element){

    var domElement =$(event.target);

    var confirmation = confirm('Weet je zeker dat je deze gebruiker wil verwijderen?');

    if(confirmation === true){
        $.ajax({
            type: 'DELETE',
            url: 'api/users/' + domElement.attr('rel'),
            contentType: 'application/json',
            success : function(e) {
                populateUserList();
                setMessage('gelukt', e);
            },
            error : function(err) {
                setMessage(err.status, err.response, false);
            }
        });
    }else{
        return false;
    }
};

function changeUser(id){
    var $page = $("tr[rel='" + id + "']");

    var roles = [];

    if($page.find("input[name='User']").is(':checked')){
        roles.push('user');
    }

    if($page.find("input[name='Admin']").is(':checked')){
        roles.push('admin');
    }

    var newData = {
        Name: $page.find("input[name='Name']").val(),
        Username: $page.find("input[name='Username']").val(),
        Email: $page.find("input[name='Email']").val(),
        Roles: roles,
        Google: $page.find("input[name='Google']").is(':checked'),
        Facebook: $page.find("input[name='Facebook']").is(':checked')
    }

    $.ajax({
        type: 'PUT',
        url: 'api/users/' + id,
        data: newData,
        success : function(e) {
            populateUserList();
            setMessage('gelukt', e);
        },
        error : function(err) {
            console.log(err);
            setMessage(err.status, err.responseText, false);
        }
    });
};