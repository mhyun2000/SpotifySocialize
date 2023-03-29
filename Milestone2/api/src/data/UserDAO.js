const db = require('./DBConnection');
const User = require('./models/User');

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
      return getUserById(results.affectedRows);
    });
}


module.exports = {
  getUsers: getUsers,
  getUserById: getUserById,
  getUserBySpotifyId: getUserBySpotifyId,
  createUser: createUser,
  updateUser: updateUser
};