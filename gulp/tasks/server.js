var gulp = require('gulp');
var path = require('path');
var Ekko = require('availity-ekko');
var proxy = require('proxy-middleware');
var _ = require('lodash');

var config = require('../config');

var servers = {
  web: {
    host: '0.0.0.0',
    port: 9999
  }
};

gulp.task('server:rest', function () {
  var ekko = new Ekko();
  return ekko.start({
    development: {
      data: path.join(config.project.path, '/data'),
      routes: path.join(config.project.path, './routes.json'),
      servers: servers
    }
  });
});

gulp.task('server:sync', ['server:rest'], function() {
  var browserSync = require('browser-sync');
  var url = require('url');
  var path = require('path');
  var fs = require('fs');
  var config = require('../config');

  // Parse out url and create the following config:
  //
  // EX:
  //
  // {
  //  host: localhost,
  //  port: 3000
  //  route: /api
  //
  // }
  var _url = _.template('http://localhost:<%= port %>/', {port: servers.web.port});
  var proxyOptions = url.parse(_url);
  proxyOptions.route = '/api';

  browserSync({
    notify: true,
    logPrefix: 'browersync',
    server: {
      baseDir: config.sync.src,
      middleware: [
        // Middleware #1: Allow web page requests without .html file extension in URLs
        function(req, res, next) {
          var uri = url.parse(req.url);
          if(uri.pathname.length > 1 && path.extname(uri.pathname) === '' && fs.existsSync('./dest' + uri.pathname + '.html')) {
            req.url = uri.pathname + '.html' + (uri.search || '');
          }
          next();
        },
        // Middleware #2: Proxy request to availity-ekko server
        proxy(proxyOptions)
      ]
    }
  });
});

