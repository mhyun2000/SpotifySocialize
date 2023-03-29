import HTTPClient from "./HTTPClient.js";

const API_USER_BASE = '/api/users';
const API_AUTH_BASE = '/api/login';

export default {  
  //  GET REQUESTS  //
  getCurrentUser: () => {
    return HTTPClient.get(API_USER_BASE+'/me');
  },

  //  POST REQUESTS  //




  //  PUT REQUESTS  //




  //  LOGIN POST REQUESTS  //

  //Login
  logIn: () => {
    return HTTPClient.post(API_AUTH_BASE+'/');
  },

  //Logout
  logOut: () => {
    return HTTPClient.post(API_AUTH_BASE+'/logout', {});
  }
};