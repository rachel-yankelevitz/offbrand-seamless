'use strict';

// packages
var express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    requestProxy = require('express-request-proxy');

var oauthSignature = require('oauth-signature');
var n = require('nonce')();
var request = require('request');
var qs = require('querystring');
var _ = require('lodash');

// Calling yelp
var request_yelp = function(queryString, callback) {
  var tokenUrl = "https://api.yelp.com/oauth2/token";
  var clientId = "5M-C08bDvKu382tlHqxq3Q";
  var clientSecret = "pybyrKf4lbAMmHbP6IeqPxrsNjn2UCA3A4DHEl8DVwLr6kOAYBCxcVklMrq3Girk";

  var searchUrl = 'https://api.yelp.com/v3/businesses/search';

  request.post(tokenUrl, {
      form: {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
      }
    }, function(error, response, body) {
      var responseBody = JSON.parse(response.body);
      var accessToken = responseBody.access_token;

      var options = {
        url: searchUrl,
        qs: queryString,
        method: 'GET',
        headers: {
          Authorization: "Bearer " + accessToken
        }
      };

      // console.log("options", options);

      request(options, function(error, response, body) {
        return callback(error, response, body);
      });
  });
};

// instantiate express
var app = express();

// compression
app.use(compress());

// logging
app.use(morgan('combined'));

// serve files in `/public` directory
app.use(express.static('public'));

app.all('/yelp*', function(req, res){
	request_yelp(req.query, function(error, response, body) {
		res.json(JSON.parse(response.body));
	});
});

// Proxy all requests to an API so sensitive information, e.g. API keys, are not exposed client-side.
// Client should make requests to /api as usual with the request path and parameters, but not include the API key.
// Query parameters are appended or replaced in `query` object.
// Any API keys should be removed client-side and set in `query`.
// See documentation here: https://github.com/4front/express-request-proxy

// BASIC FORMAT:
// `/api/*` is the url we want to call from the client, e.g. `app.js`, for the API. Make sure you keep the `*` is kept.
// app.all('/api/*', requestProxy({
//   url: 'http://API_URL/*', // must keep `*`
//   query: {
//     // `apiKey` should correspond to the name of the query param the API expects
//     apikey: 'process.env.API_KEY_NAME'
//   }
// }));

module.exports = app;
