const db = require('./DBConnection');
const User = require('./models/User');
const UserFriend = require('./models/User_Friend');

// All user related queries
function getUsers() {
  return db.query('SELECT * FROM user').then(({results}) => {
    return results.map(user => new User(user));
  });
}

function getUserById(userId) {
  return db.query('SELECT * FROM user WHERE user_id=?', [userId]).then(({results}) => {
    if(results[0])
      return new User(results[0]);
  });
}

function getUserBySpotifyId(spotify_userId) {
    return db.query('SELECT * FROM user WHERE user_spotify_id=?', [spotify_userId]).then(({results}) => {
      if(results[0])
        return new User(results[0]);
    });
}

function createUser(user) {
  return db.query('INSERT INTO user (user_display_name, user_spotify_id, user_email, user_country, user_follower_count) VALUES (?, ?, ?, ?, ?)', [user.name, user.spotify_id, user.email, user.country, user.followers]).then(({results}) => {
    return getUserById(results.insertId);
  });
}

function updateUser(user) {
    return db.query('UPDATE user SET user_display_name = ?, user_spotify_id = ?, user_email = ?, user_country = ?, user_follower_count = ? WHERE user_spotify_id = ?', [user.name, user.spotify_id, user.email, user.country, user.followers, user.spotify_id]).then(({results}) => {
      if (results.affectedRows) {
        return getUserBySpotifyId(user.spotify_id);
      }
    });
}

// All friend related queries
function getfriends(userId) {
    return db.query('SELECT * FROM user JOIN user_friend ON uft_friend_id=user_id WHERE uft_user_id=?', [userId]).then(({results}) => {
      return results.map(user => new User(user));
    });
}

function checkUserFriend(userId, friendId) {
  return db.query('SELECT * FROM user_friend WHERE uft_user_id=? AND uft_friend_id=?', [userId, friendId]).then(({results}) => {
    if(results[0])
      return new UserFriend(results[0]);
  });
}

function createUserFriend(userId, friendId) {
  return db.query('REPLACE INTO user_friend (uft_user_id, uft_friend_id) VALUES (?, ?)', [userId, friendId]).then(({results}) => {
    return results.affectedRows;
  });
}

function removeUserFriend(userId, friendId) {
  return db.query('DELETE FROM user_friend WHERE uft_user_id=? AND uft_friend_id=?', [userId, friendId]).then(({results}) => {
    console.log("DELETE SQL response:" + results);
    if(results[0])
      return new UserFriend(results[0]);
  });
}



module.exports = {
  getUsers: getUsers,
  getUserById: getUserById,
  getUserBySpotifyId: getUserBySpotifyId,
  createUser: createUser,
  updateUser: updateUser,
  getfriends: getfriends,
  checkUserFriend: checkUserFriend,
  createUserFriend: createUserFriend,
  removeUserFriend: removeUserFriend
};