import HTTPClient from "./HTTPClient.js";

const API_USER_BASE = '/api/users';
const API_AUTH_BASE = '/api/login';

export default {  
  //  GET REQUESTS  //
  getCurrentUser: () => {
    return HTTPClient.get(API_USER_BASE+'/me');
  },

  getUserBySpotifyId: (spotifyId) => {
    return HTTPClient.get(API_USER_BASE+'?spotifyId=' + spotifyId);
  },

  getUserFriends: (userId) => {
    return HTTPClient.get(API_USER_BASE+'/friends?userId=' + userId);
  },

  getUserSongs: (userId) => {
    return HTTPClient.get(API_USER_BASE+'/songs?userId=' + userId);
  },

  getAllUsers: () => {
    return HTTPClient.get(API_USER_BASE+'/all' );
  },

  getRelationship: (userId, friendId) => {
    return HTTPClient.get(API_USER_BASE+'/checkfriend?userId=' + userId + '&friendId=' + friendId);
  },

  //TESTING PATH
  getAllSongRelationships: () => {
    return HTTPClient.get(API_USER_BASE+'/testRelationships');
  },


  

  //  POST REQUESTS  //

  addFriends: (userId, friends) => {
    let data = {
      userId: userId,
      friends: friends,
    }
    return HTTPClient.post(API_USER_BASE+'/addFriends', data);
  },

  createMyPlaylist: (user, playlistName) => {
    let data = {
      user: user,
      playlistName: playlistName
    }
    return HTTPClient.post(API_USER_BASE+'/myplaylist', data);
  },


  //  PUT REQUESTS  //
  updateCurrentUser: (userId) => {
    let data = {
      userId: userId,
    }
    return HTTPClient.put(API_USER_BASE+'/refresh', data);
  },

  //  DELETE REQUESTS  //
  removefriends: (userId, friends) => {
    let data = {
      userId: userId,
      friends: friends,
    }
    return HTTPClient.delete(API_USER_BASE+'/removefriends', data);
  },


  //  LOGIN POST REQUESTS  //

  //Login
  logIn: () => {
    return HTTPClient.post(API_AUTH_BASE+'/');
  },

  //Logout
  logOut: () => {
    return HTTPClient.post(API_AUTH_BASE+'/logout');
  }
};