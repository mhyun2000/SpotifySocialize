module.exports = class {
    constructor(data) {
      this.id = data.user_id;
      this.name = data.user_display_name;
      this.spotify_id = data.user_spotify_id;
      this.email = data.user_email;
      this.country = data.user_country;
      this.followers = data.user_follower_count;
    }
  
  };