const express = require('express'); // Express web server framework
const request = require('request'); // Request library
var cors = require('cors'); // Allows a server to indivate any origins https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
var urlSP = require('URLSearchParams'); // urlSearchParams API
var cookieParser = require('cookie-parser'); // cookie-parser module, install using npm?

var client_id = 'f3064ccbb7754b58b62bd7d795435840'; // Spotify web app Client ID
var client_secret = 'ec1c709191564f50bd3099e8e1ea8b94'; // Client secret (don't share)
var redirect_uri = 'http://localhost/callback'; // Your redirect uri

var app = express();
const PORT = process.env.PORT;

// logic for authorizing then logging into the Spotify service

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
 var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  var stateKey = 'spotify_auth_state';

// Designate the static folder as serving static resources
app.use(express.static(__dirname + '/static'))
  .use(cors()) // added usage of cors
  .use(cookieParser()); // added usage of cookieParser

app.get('/login', function(req, res) {

        
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email user-follow-read user-top-read';

    // using the urlSearchParams API instead of querystring to create a string url for the query

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    })

    // urlSP.append(response_type, 'code');
    // urlSP.append(client_id, client_id);
    // urlSP.append(scope, scope);
    // urlSP.append(redirect_uri, redirect_uri);
    // urlSP.append(state, state);

    // res.redirect('https://accounts.spotify.com/authorize?' +
    //     urlSP.stringify({
    //     response_type: 'code',
    //     client_id: client_id,
    //     scope: scope,
    //     redirect_uri: redirect_uri,
    //     state: state
    //     }));
    // });

    res.redirect('https://accounts.spotify.com/authorize?' +
        params.toString());
});


app.get('/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter
  
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
  
    if (state === null || state !== storedState) {
        const params = new URLSearchParams({
            error: 'state_mismatch',
        })
        //urlSP.append(error, 'state_mismatch');
      res.redirect('/#' +
      params.toString());
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) // changed new Buffer to Buffer.from
        },
        json: true
      };
  
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
  
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
  
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body);
          });
  
          // we can also pass the token to the browser to make requests from there
          const params = new URLSearchParams({
                access_token: access_token,
                refresh_token: refresh_token
            })
        //   urlSP.append(access_token, access_token);
        //   urlSP.append(refresh_token, refresh_token);
          res.redirect('/#' +
            params.toString());
        } else {
            const params = new URLSearchParams({
                error: 'invalid_token'
            })
          res.redirect('/#' +
            params.toString());
        }
      });
    }
  });
  
  app.get('/refresh_token', function(req, res) {
  
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) }, // changed new Buffer to Buffer.from
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });


// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));