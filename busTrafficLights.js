var restbus  = require('restbus'),
    http     = require('http'),
    //bancroft = require('bancroft'),
    //i2c      = require('i2c'),
    //gpio     = require('pi-gpio'),
    port     = '3535',
    lon      = '-122.471005',
    lat      = '37.765547';

function buildPath(lat,lon) {
  return '/locations/'+lat+','+lon+'/predictions';
}

restbus.listen(port, function() {
  var path = buildPath(lat,lon),
      options = {
        hostname: 'localhost',
        port: port,
        path: path
      };

  http.get(options, function(res) {
    res.setEncoding('utf8');
    res.on("data", function(body) {
      var data = JSON.parse(body);

      for (var predictions in data) {
        var prediction = data[predictions],
            tab        = '\t',
            agency     = prediction.agency.title,
            route      = prediction.route.title,
            stop       = prediction.stop.title,
            distance   = prediction.stop.distance;

        for (var values in prediction.values) {
          var value     = prediction.values[values],
              direction = value.direction.title,
              minutes   = value.minutes,
              debug     = agency+tab+route+tab+stop+tab+distance+tab+direction
              +tab+minutes;

          console.log(debug);
        };
      };
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });

  // process.exit(0);
});
