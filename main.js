Notification.requestPermission().then(function (status) {
    if (status === 'denied') {
        console.log('[Notification.requestPermission] The user has blocked notifications.');
    } else if (status === 'granted') {
        console.log('[Notification.requestPermission] Initializing service worker.');
    }
});

$("#latlng").text('location: Remember to enable GPS')

$("#form").submit(function(e){
    return false;
});

$.makeTable = function (mydata) {
    var table = $('<table border=1>');
    var tblHeader = "<tr>";
    for (var k in mydata[0]) tblHeader += "<th>" + k + "</th>";
    tblHeader += "</tr>";
    $(tblHeader).appendTo(table);
    $.each(mydata, function (index, value) {
        var TableRow = "<tr>";
        $.each(value, function (key, val) {
            TableRow += "<td>" + val + "</td>";
        });
        TableRow += "</tr>";
        $(table).append(TableRow);
    });
    return ($(table));
};

let affectedMap = L.map('affected', {
  zoom: 10,
  center: L.latLng(46.8772, -96.7898)
});

 L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
   maxZoom: 18,
   id: 'mapbox.streets',
   accessToken: 'pk.eyJ1IjoiYXJjdGFpciIsImEiOiJjajZ0azlxc28wZnp5MndvNGZkOG9waXVmIn0.QkUWyUDc1TjXFn6K0DB1rg'
 }).addTo(affectedMap);

$.ajax({
  type: "GET",
  url: 'http://localhost:8080/api/v1/message',
  dataType: 'json',
  success: (data) => {
    L.geoJSON(data[0].geojson).addTo(affectedMap)
    data.forEach((el) => {
      delete el.affected
      delete el.geojson
    })
    let table = $.makeTable(data);
    $(table).appendTo("#table");
  },
  error: (err) => {
    console.log(err)
  }
});

navigator.geolocation.getCurrentPosition((position) => {
  window.latlng = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  }
  $("#latlng").text(`location: lat: ${latlng.lat}, lng: ${latlng.lng}`)
});

setTimeout(() => {
  new Notification('Notice: Broadway parking', { body: 'Parking on broadway blocked off for event X' });
}, 20000);


setTimeout(() => {
  new Notification('Warning: Storm approaching West Fargo', { body: 'Stay indoors and wait until further direction' });
}, 23000);
