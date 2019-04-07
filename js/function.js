$(document).bind('mobileinit',function(){
  $.mobile.changePage.defaults.changeHash = false;
  $.mobile.hashListeningEnabled = false;
  $.mobile.pushStateEnabled = false;
});

function initMap(){
  map = new L.Map('map', { minZoom: 13 }).setView([46.1220, 11.1876], 13);
  lyr = L.tileLayer('map/basemap/{z}/{x}/{y}.png', {tms: true, opacity: 0.7, attribution: ""}).addTo(map);
  $.getJSON('json/punti.geojson',function (data) {
    if (!data.features) {
      map.setView(new L.LatLng(46.1220, 11.1876), 13);
    }else {
      punti = L.geoJSON(data, { onEachFeature: bindPopUp });
      map.addLayer(punti);
      map.fitBounds(punti.getBounds());
    }
  });
  $.getJSON('json/sentieri.geojson',function (data) {
      sentieri = L.geoJSON(data).addTo(map);
  });
  startView = L.Control.extend({
    options: { position: 'topleft'},
    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'extentControl leaflet-bar leaflet-control leaflet-touch');
      btn=$("<a/>",{href:'#'}).appendTo(container);
      $("<i/>",{class:'fas fa-home'}).appendTo(btn)
      btn.on('click', function () {map.fitBounds(punti.getBounds());});
      return container;
    }
  })

  map.addControl(new startView());
  src = 'Generated by <a href="http://www.klokan.cz/projects/gdal2tiles/">GDAL2Tiles</a>';
  title = L.control({position: 'bottomleft'});
  title.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'ctl src leaflet-control-attribution');
    this.update();
    return this._div;
  };
  title.update = function(props) { this._div.innerHTML = src; };
  title.addTo(map);
  map.setMaxBounds(map.getBounds());
}

function bindPopUp (feature, layer) {
  prop = feature.properties;
  popup="<h5 class='card-title border-bottom'>"+prop.nome+"</h5>";
  popup += "<a href='poi.php?poi="+prop.id+"' title='view complete poi info' class='text-success card-link'>...more info</a>";
  layer.bindPopup(popup)
}
