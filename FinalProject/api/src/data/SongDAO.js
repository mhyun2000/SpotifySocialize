const db = require('./DBConnection');
const Song = require('./models/Song');
const UserSong = require('./models/User_Song');

// All user related queries
function getAllSongs() {
  return db.query('SELECT * FROM song').then(({results}) => {
    return results.map(song => new Song(song));
  });
}

function getSongById(songId) {
  return db.query('SELECT * FROM song WHERE song_id=?', [songId]).then(({results}) => {
    if(results[0])
      return new Song(results[0]);
  });
}

function getSongBySpotifyId(spotify_songId) {
    return db.query('SELECT * FROM song WHERE song_spotify_id=?', [spotify_songId]).then(({results}) => {
      if(results[0])
        return new Song(results[0]);
    });
}

function getSongByName(songName) {
    return db.query('SELECT * FROM song WHERE song_name=?', [songName]).then(({results}) => {
      if(results[0])
        return new Song(results[0]);
    });
}

function createSong(song) {
  return db.query('INSERT INTO song (song_name, song_spotify_id, song_artist, song_album, song_uri) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE song_spotify_id=song_spotify_id;', [song.name, song.spotify_id, song.artist, song.album, song.uri]).then(({results}) => {
    if (results.affectedRows > 0) {
      return getSongBySpotifyId(song.spotify_id);
    }
  })
}

// All User_Song related queries
function getUsersSongs(userId) {
    return db.query('SELECT * FROM song JOIN user_song ON ust_song_id=song_id WHERE ust_user_id=?', [userId]).then(({results}) => {
      return results.map(song => new Song(song));
    });
}

function getUserSong(userId, songId) {
  return db.query('SELECT * FROM user_song WHERE ust_user_id=? AND ust_song_id=?', [userId, songId]).then(({results}) => {
    if(results[0])
      return new UserSong(results[0]);
  });
}

function allUserSongsRelationships() {
  return db.query('SELECT * FROM user_song').then(({results}) => {
    if(results[0])
      return results.map(relationship => new UserSong(relationship));
  });
}

function createUserSong(userId, songId) {
  return db.query('INSERT INTO user_song (ust_user_id, ust_song_id) VALUES (?, ?)', [userId, songId]).then(({results}) => {
    return results.affectedRows;
  }).catch((err) => {
    return 0;
  });
}



module.exports = {
  getAllSongs: getAllSongs,
  getSongById: getSongById,
  getSongBySpotifyId: getSongBySpotifyId,
  getSongbyName: getSongByName,
  createSong: createSong,
  getUsersSongs: getUsersSongs,
  getUserSong: getUserSong,
  createUserSong: createUserSong,
  allUserSongsRelationships: allUserSongsRelationships
};