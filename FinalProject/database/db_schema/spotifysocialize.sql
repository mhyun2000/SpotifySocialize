CREATE DATABASE IF NOT EXISTS `spotifysocialize`;
USE `spotifysocialize`;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_display_name` varchar(100) NOT NULL,
  `user_spotify_id` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_country` varchar(100) NOT NULL,
  `user_follower_count` int(10) unsigned NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `song` (
  `song_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `song_name` varchar(100) NOT NULL,
  `song_spotify_id` varchar(100) NOT NULL,
  `song_artist` varchar(100),
  `song_album` varchar(200) NOT NULL,
  `song_uri` varchar(100) NOT NULL,
  PRIMARY KEY (`song_id`),
  UNIQUE KEY (`song_spotify_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_song` (
  `ust_user_id` int(10) unsigned NOT NULL,
  `ust_song_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ust_user_id`,`ust_song_id`),
  KEY `FK_UST_USER` (`ust_user_id`),
  CONSTRAINT `FK_UST_USER` FOREIGN KEY (`ust_user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_UST_SONG` FOREIGN KEY (`ust_song_id`) REFERENCES `song` (`song_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_friend` (
  `uft_user_id` int(10) unsigned NOT NULL,
  `uft_friend_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`uft_user_id`,`uft_friend_id`),
  KEY `FK_UFT_USER` (`uft_user_id`),
  CONSTRAINT `FK_UFT_USER` FOREIGN KEY (`uft_user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_UFT_FRIEND` FOREIGN KEY (`uft_friend_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;