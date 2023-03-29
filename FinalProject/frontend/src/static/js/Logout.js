import api from './APIClient.js';

const message = document.getElementById('message');

//const hyperLink = document.getElementById('url');

api.logOut().then((userData) => {
    console.log("Logged Out");
    console.log(userData);

    window.location.href = "https://accounts.spotify.com/en/logout";



    //let fullURL = "https://accounts.spotify.com/en/logout";
    //hyperLink.setAttribute('href', fullURL);

}).catch((err) => {
    console.log("Unsuccessful logout!");
});