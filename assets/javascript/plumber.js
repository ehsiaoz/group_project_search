var clientId = "bFsYoU3XZ9l9PklclAYiUA";
var clientSecret = "Xuf7ZHrnP193gXCGPmMCSHYDpjfzHsOKRWlu3OOCxkRthnadn57pjnanZX1kfI8a";

var authorizationBasic = window.btoa(clientId + ':' + clientSecret);

$.ajax({
    type: 'POST',
    url: 'https://api.yelp.com/oauth2/token',
    data: { grant_type: 'client_credentials' },
    dataType: "json",
    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
    xhrFields: {
       withCredentials: true
    },
    // crossDomain: true,
    headers: {
    'Authorization': 'Basic ' + authorizationBasic
    },
    //beforeSend: function (xhr) {
    //},
    success: function (result) {
    var token = result;
    },
    //complete: function (jqXHR, textStatus) {
    //},
    error: function (req, status, error) {
    alert(error);
    }
});