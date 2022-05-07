function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
var id = getParameterByName('id');
console.log(id); 
 const m= async ()=>{
  await google.maps.event.addDomListener(window, 'load', initialize);

 }
 m()
//Load google map
var position = [11.123, 77.8083];
var pinIcon = new google.maps.MarkerImage(
  "/car.png",
  null, /* size is determined at runtime */
  null, /* origin is 0,0 */
  null, /* anchor is bottom center of the scaled image */
  new google.maps.Size(42, 68)
);
function initialize() {
  var latlng = new google.maps.LatLng(position[0], position[1]);
  var myOptions = {
    zoom: 16,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);

  marker = new google.maps.Marker({
    icon: pinIcon,
    position: latlng,
    map: map,
    title: "Latitude:" + position[0] + " | Longitude:" + position[1]
  });

}




var numDeltas = 100;
var delay = 10; //milliseconds
var i = 0;
var deltaLat;
var deltaLng;

function transition(result) {
  // i = 0;
  // deltaLat = (result[0] - position[0]) / numDeltas;
  // deltaLng = (result[1] - position[1]) / numDeltas;

  //moveMarker();
}
function transitionUsingLatLng(result) {
  i = 0;
  // deltaLat = (result[0] - position[0]) / numDeltas;
  // deltaLng = (result[1] - position[1]) / numDeltas;                                                  
  deltaLat = result.lat;
  deltaLng = result.lng;
  moveMarker();
}

function moveMarker() {
  position[0] = deltaLat;
  position[1] = deltaLng;
  var latlng = new google.maps.LatLng(position[0], position[1]);
  map.panTo(latlng)
  map.setZoom(18)
  marker.setTitle("Latitude:" + position[0] + " | Longitude:" + position[1]);
  marker.setPosition(latlng);

  if (i != numDeltas) {
    i++;
    setTimeout(moveMarker, delay);
  }
}


function getData() {
  const socket = getSocket()
  console.log(socket);
  socket.on("connect", () => {
    console.log("connect channel connected")
  })

  let d = {
    db: "Booking",
    on: "change",
    id: id,
    by: "admin",
  }

  socket.emit("sub", d)


  socket.on("booking", (res) => {
    console.log("DB change Channel Connected")

    console.log("response from db change", res)
    transitionUsingLatLng({ lat: res?.driverLoc?.position[0], lng: res?.driverLoc?.position[1] })
  })



}

const getSocket = () => {
  let socket = null

  if (socket === null) {
    socket = io("wss://fleto-api.reciprocal.co.in", {
      transports: ["websocket"],
    })
    console.log("Socket As Been Connected")
  }
  return socket
}

getData()