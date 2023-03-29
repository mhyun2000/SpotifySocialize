const express = require('express');
const cors = require('cors');  // Allows a server to indivate any origins https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
const cookieParser = require('cookie-parser'); // cookie-parser module, install using npm?
const loginRouter = express.Router();

loginRouter.use(express.json())
    .use(cors()) // added usage of cors
    .use(cookieParser()); // added usage of cookieParser

/* Spotify Authentication */
var client_id = process.env.CLIENT_ID; // Spotify web app Client ID
var client_secret = process.env.CLIENT_SECRET; // Client secret (don't share)
var redirect_uri = 'http://localhost/api/login/callback'; // Your redirect uri

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


//login 
loginRouter.post('/', (req,  res) => {

    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email user-follow-read user-top-read playlist-read-private playlist-read-collaborative user-library-read playlist-modify-public playlist-modify-private';
    var escapedRedirect = "http%3A%2F%2Flocalhost%2Fapi%2Flogin%2Fcallback";
    res.cookie(stateKey, state);

    res.json({
                client_id: client_id,
                response_type: 'code',
                redirect_uri: escapedRedirect,
                state: state,
                scope: scope,
                show_dialog: false
    });
});

loginRouter.get('/callback', function(req, res) {  
    // response when successful login
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    // reponse when failed login
    var error = req.query.error || null;
  
    if (state === null || state !== storedState) { // double check that state matches stored state
        const params = new URLSearchParams({
            error: 'state_mismatch'
        })
        res.redirect('/#' +
        params.toString());
    } else if (error !== null) { // case where login fails
        const params = new URLSearchParams({
            error: 'failed_authentication',
        })
        res.redirect('/#' +
        params.toString());
    } else {
        // res.clearCookie(stateKey);
        // Make POST to Spotify for access token and refresh token
        getFirstToken(code).then((data) => {
            var error = data.error || null;
            if (error) { //ERROR case redirect to an error page
                const params = new URLSearchParams({
                    ERROR: error,
                    ERROR_DESCRIPTION: error_description
                })
                res.redirect('/#' + params.toString());
            } else {
                res.cookie('spotify_access_token', data.access_token, { httpOnly: true });
                res.cookie('spotify_refresh_token', data.refresh_token, { httpOnly: true });
                res.redirect('/home');
            }            
        })
    }
});

//Refresh token
loginRouter.get('/refresh_token', function(req, res) { 
    // requesting access token from refresh token
    var refresh_token = req.cookies['spotify_refresh_token'];
    // Make POST to Spotify for access token and refresh token
    getRefreshedToken(refresh_token).then((data) => {
        expiration = parseInt(data.expires_in);
        var error = data.error || null;
        if (error) { //ERROR case send error response
            const params = new URLSearchParams({
                ERROR: error,
                ERROR_DESCRIPTION: error_description
            })
            res.redirect('/#' + params.toString());
        } else {
            res.cookie('spotify_access_token', data.access_token, { httpOnly: true })
        }            
    })
});
  
//Logout
loginRouter.post('/logout', (req,  res) => {
    // clear token cookies
    res.cookie('spotify_access_token', "", { httpOnly: true })
        .cookie('spotify_refresh_token', "", { httpOnly: true })
        .cookie(stateKey, "", { httpOnly: true });
    res.clearCookie('spotify_access_token');
    res.clearCookie('spotify_refresh_token');
    res.clearCookie(stateKey);

    res.json({success: true});
});

// async function to retrieve access token and refresh token
async function getFirstToken(code) {
    // x-www-form-urlencoded body
    const body = new URLSearchParams({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    })

    let url = 'https://accounts.spotify.com/api/token';

    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        }
    });

    return response.json();
}

// async function to retrieve access token and refresh token
async function getRefreshedToken(refreshToken) {
    // x-www-form-urlencoded body
    const body = new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
    })

    let url = 'https://accounts.spotify.com/api/token';

    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        }
    });

    return response.json();
}

module.exports = loginRouter;