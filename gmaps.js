var customLabel = {
    restaurant: {
        label: 'R'
    },
    bar: {
        label: 'B'
    }
};

$(window).load(function() {
    $("#loaderInner").fadeOut();
    $("#loader").delay(400).fadeOut("slow");
});

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(55.75370903771494, 37.61981338262558),
        zoom: 15,
        disableDefaultUI: true,
        fullscreenControl: true,
        styles: [

            {
                "elementType": "geometry",
                "stylers": [{
                    "color": "#ebe3cd"
                }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#523735"
                }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#f5f1e6"
                }]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#c9b2a6"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#dcd2be"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#ae9e90"
                }]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#93817c"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#a5b076"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#447530"
                }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f1e6"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#fdfcf8"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f8c967"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#e9bc62"
                }]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e98d58"
                }]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#db8555"
                }]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#806b63"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#8f7d77"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#ebe3cd"
                }]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#b9d3c2"
                }]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#92998d"
                }]
            }

        ]
    });
    infoWindow = new google.maps.InfoWindow();


    var directionsDisplay;


    function calcRoute(myLat, myLng, toLat, toLng, map, onAir = false, flightPlanCoordinates = []) {
        /*
        Рисует маршрут доставки на карте. Берет маршрут по дорогам у гугла.
        Для летательных аппаратов необходимо задавать флаг onAir и по желанию указывать маршрут.
        Если не указан строит прямую линию от начальной до конца.

        Путь задается в формате:

        var flightPlanCoordinates = [
          {lat: 37.772, lng: -122.214},
          {lat: 21.291, lng: -157.821},
          {lat: -18.142, lng: 178.431},
          {lat: -27.467, lng: 153.027}
        ];

        */

        // Настройки рендерера путей DirectionsService
        var polylineColorSettings = {
            // Настройки цвета линии
            strokeColor: "blue",
            geodesic: true,
            strokeOpacity: 0.4,
            strokeWeight: 5
        }
        var directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer({
            polylineOptions: polylineColorSettings
        });

        // Маркеры на начало и конец пути
        var start = new google.maps.LatLng(myLat, myLng);
        var end = new google.maps.LatLng(toLat, toLng);

        var startMarker = new google.maps.Marker({
            position: start,
            map: map,
            draggable: false,
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/purple.png"
            }
        });
        var endMarker = new google.maps.Marker({
            position: end,
            map: map,
            draggable: false,
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/purple.png"
            }
        });

        var bounds = new google.maps.LatLngBounds();
        bounds.extend(start);
        bounds.extend(end);
        map.fitBounds(bounds);

        if (!onAir) {

            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.WALKING
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(map);
                    directionsDisplay.setOptions({
                        suppressMarkers: true
                    });
                    var distance = google.maps
                        .geometry.spherical.computeDistanceBetween(start, end);
                    //console.log( Math.round(distance) + "Km" );
                    console.log("Расстояние: " + Math.round(distance) / 1000 + " Км");
                } else {
                    alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                }
            });
        } else {
            // добавляем в путь начало и конец
            flightPlanCoordinates.unshift({
                lat: myLat,
                lng: myLng
            })
            flightPlanCoordinates.push({
                lat: toLat,
                lng: toLng
            })
            console.log(flightPlanCoordinates)
            polylineColorSettings['path'] = flightPlanCoordinates;
            polylineColorSettings['geodesic'] = true;

            var flightPath = new google.maps.Polyline(polylineColorSettings);

            flightPath.setMap(map);

        }

    }


    var marker = null;
    var myPosLat;
    var myPosLon;

    function autoUpdate() {
        /*
                navigator.geolocation.getCurrentPosition(function(position) {
                    var newPoint = new google.maps.LatLng(position.coords.latitude,
                        position.coords.longitude);
                    myPosLat = position.coords.latitude;
                    myPosLon = position.coords.longitude;
                    console.log(position.coords.latitude,
                        position.coords.longitude);
                    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
                    var icons = {
                        parking: {
                            icon: iconBase + 'parking_lot_maps.png'
                        },
                        library: {
                            icon: iconBase + 'library_maps.png'
                        },
                        info: {
                            icon: iconBase + 'info-i_maps.png'
                        }
                    };



                        // Marker does not exist - Create it
                        marker = new google.maps.Marker({
                            position: newPoint,
                            map: map,
                            icon: "location.png"
                        });
                        marker.addListener('click', function() {
                            infoWindow.setContent("<div>Ваше местоположение</div>");
                            infoWindow.open(map, marker);
                        });


                    // Center the map on the new position
                    map.setCenter(newPoint);
                });
        */

    }

    autoUpdate();

    lat_from = 55.8104315;
    lon_from = 37.4981706;

    lat_to = 55.75370903771494;
    lon_to = 37.61981338262558;
    fligthPath = [{ // Залетим в магазин по пути
            lat: 55.7904,
            lng: 37.5313
        },
        {
            lat: 55.7854,
            lng: 37.5313
        }
    ]
    calcRoute(lat_from, lon_from, lat_to, lon_to, map, onAir = true, flightPlanCoordinates = fligthPath);

    // Change this depending on the name of your PHP or XML file
    /*
    downloadUrl('https://ca9a236a.ngrok.io/execute?lat='+55.8104315+'&lon='+37.4981706, function(data) {
        var xml = data.responseXML;
        var markers = xml.documentElement.getElementsByTagName('marker');
        Array.prototype.forEach.call(markers, function(markerElem) {
            var id = markerElem.getAttribute('id');
            var name = markerElem.getAttribute('title');
            var description = document.createElement('div');
            description.textContent = 'Расстояние: 0 метров.';
            var text_in = markerElem.getAttribute('description');
            var date_container_b = document.createElement('div');
            var date_b = markerElem.getAttribute('datestart');
            var date_container_e = document.createElement('div');
            var date_e = markerElem.getAttribute('dateend');
            date_container_b.textContent = 'Начало: ' + date_b;
            date_container_e.textContent = 'Конец:  ' + date_e;
            $(date_container_b).css("padding-top", "15px");
            $(date_container_e).css("padding-bottom", "15px");
            var point_lat = parseFloat(markerElem.getAttribute('lat'));
            var point_lon = parseFloat(markerElem.getAttribute('lon'));
            var point = new google.maps.LatLng(
                parseFloat(markerElem.getAttribute('lat')),
                parseFloat(markerElem.getAttribute('lon')));

            var infowincontent = document.createElement('div');
            var strong = document.createElement('strong');
            strong.textContent = name
            infowincontent.appendChild(strong);
            infowincontent.appendChild(date_container_b);
            infowincontent.appendChild(date_container_e);
            infowincontent.appendChild(description);
            $(description).addClass('distance');
            infowincontent.appendChild(document.createElement('br'));

            var text = document.createElement('text');
            text.textContent = text_in;

            infowincontent.appendChild(text);
            var icon = {};
            var marker = new google.maps.Marker({
                map: map,
                position: point,
                label: icon.label,
                icon: "location_user.png"
            });
            $(infowincontent).addClass('pop_up_event');
            marker.addListener('click', function() {
                //console.log(directionsDisplay);
                if(directionsDisplay !== undefined) {
                  directionsDisplay.setDirections({routes: []});
                }

                infoWindow.setContent(infowincontent);
                infoWindow.open(map, marker);

                calcRoute(myPosLat, myPosLon, point_lat, point_lon, map);

            });
        });
    });
*/
}




function downloadUrl(url, callback) {
    var request = window.ActiveXObject ?
        new ActiveXObject('Microsoft.XMLHTTP') :
        new XMLHttpRequest;

    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            request.onreadystatechange = doNothing;
            callback(request, request.status);
        }
    };

    request.open('GET', url, true);
    request.send(null);
}


function doNothing() {}
