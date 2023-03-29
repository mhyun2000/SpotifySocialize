import api from './APIClient.js';

const hyperLink = document.getElementById('url');

api.logIn().then(userData => {
  let response_type = userData.response_type;
  let state = userData.state;
  let scope = userData.scope;
  let client_id = userData.client_id;
  let redirect_uri = userData.redirect_uri;

  let fullURL = "https://accounts.spotify.com/authorize?" + "response_type=" + response_type + 
    "&client_id=" + client_id + "&scope=" + scope + "&redirect_uri=" + redirect_uri + "&state=" + state;
  hyperLink.setAttribute('href', fullURL);
  
  // localStorage.setItem('user', JSON.stringify(userData.user));
  // document.location = "/home";
}).catch((err) => {
  console.log("AN ISSUE OCCURED SETTING THE HYPER LINK");
});