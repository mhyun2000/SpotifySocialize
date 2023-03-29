module.exports = class {
    constructor(data) {
      this.id = data.song_id;
      this.name = data.song_name;
      this.spotify_id = data.song_spotify_id;
      this.artist = data.song_artist;
      this.album = data.song_album;
      this.uri = data.song_uri;
    }
  
  };