//var routeListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    populateRouteList(true);

    // route link click
    $('#list').on('click', 'a.route-list-item', showRouteInfo);

    // // Add User button click
    // $('#btnAddUser').on('click', addUser);

    //  // Delete User link click
    // $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

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

// Show Route Info
function showRouteInfo(event) {

    // Getting ready
    $('.email-content-title').text('Data word opgehaald');

    // Select requested item
    $('div.email-item').removeClass('email-item-selected email-item-unread');
    $(this).find('div.email-item').addClass('email-item-selected email-item-unread');

    // jQuery AJAX call for JSON
    $.getJSON( '/routes/' + $(this).attr('rel'), function( data ) {

        $('.email-content-title').text('Route details');
        $('.email-content-subtile').text('Toegevoegd op ' + data.Meta.Created);
        $('#change-route').attr('rel', data._id);
        $('#delete-route').attr('rel', data._id);
    }).fail(function(err){
        $('#message').html('<div class="error"><a href="#" onclick="closeMessage()">X</a><strong>Error ' + err.status + '</strong> ' + err.responseText + '</div>');
    });
};

// // Add User
// function addUser(event) {
//     event.preventDefault();

//     // Super basic validation - increase errorCount variable if any fields are blank
//     var errorCount = 0;
//     $('#addUser input').each(function(index, val) {
//         if($(this).val() === '') { errorCount++; }
//     });

//     // Check and make sure errorCount's still at zero
//     if(errorCount === 0) {

//         // If it is, compile all user info into one object
//         var newUser = {
//             'username': $('#addUser fieldset input#inputUserName').val(),
//             'email': $('#addUser fieldset input#inputUserEmail').val(),
//             'fullname': $('#addUser fieldset input#inputUserFullname').val(),
//             'age': $('#addUser fieldset input#inputUserAge').val(),
//             'location': $('#addUser fieldset input#inputUserLocation').val(),
//             'gender': $('#addUser fieldset input#inputUserGender').val()
//         }

//         // Use AJAX to post the object to our adduser service
//         $.ajax({
//             type: 'POST',
//             data: newUser,
//             url: '/users/adduser',
//             dataType: 'JSON'
//         }).done(function( response ) {

//             // Check for successful (blank) response
//             if (response.msg === '') {

//                 // Clear the form inputs
//                 $('#addUser fieldset input').val('');

//                 // Update the table
//                 populateTable();

//             }
//             else {

//                 // If something goes wrong, alert the error message that our service returned
//                 alert('Error: ' + response.msg);

//             }
//         });
//     }
//     else {
//         // If errorCount is more than 0, error out
//         alert('Please fill in all fields');
//         return false;
//     }
// };

// // Delete User
// function deleteUser(event) {

//     event.preventDefault();

//     // Pop up a confirmation dialog
//     var confirmation = confirm('Are you sure you want to delete this user?');

//     // Check and make sure the user confirmed
//     if (confirmation === true) {

//         // If they did, do our delete
//         $.ajax({
//             type: 'DELETE',
//             url: '/users/deleteuser/' + $(this).attr('rel')
//         }).done(function( response ) {

//             // Check for a successful (blank) response
//             if (response.msg === '') {
//             }
//             else {
//                 alert('Error: ' + response.msg);
//             }

//             // Update the table
//             populateTable();

//         });

//     }
//     else {

//         // If they said no to the confirm, do nothing
//         return false;

//     }

// };
