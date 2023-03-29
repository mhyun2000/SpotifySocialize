const express = require('express');
const cors = require('cors');  // Allows a server to indivate any origins https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
const cookieParser = require('cookie-parser'); // cookie-parser module, install using npm?
const usersRouter = express.Router();

usersRouter.use(express.json())
    .use(cors()) // added usage of cors
    .use(cookieParser()); // added usage of cookieParser

const UserDAO = require('../data/UserDAO');
const SongDAO = require('../data/SongDAO');

// utility function to perform wait in async function
// https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
const delay = ms => new Promise(res => setTimeout(res, ms));

// Contains the songs for associated with each userid. The userId may not have been an active user of the application
// and could simply be a friend of a user.

//Get Current User Profile Also Creates the User if they have not used the app before
usersRouter.get('/me', (req,  res) => {
    let url = 'https://api.spotify.com/v1/me';

    let headers = {
        'Authorization': 'Bearer ' + req.cookies['spotify_access_token']
    }

    get(url, headers).then((data) => {
        var error = data.error || null;
        if (error) {
            return res.status(error.status).json({error: error});
        } else {
            // Update if this user already exists in the system
            // otherwise Create new
            let param = {
                name: data.display_name,
                spotify_id: data.id,
                email: data.email,
                country: data.country,
                followers: data.followers.total
            }
            console.log(param);

            UserDAO.getUserBySpotifyId(data.id).then(user => {
                if (user) {
                    UserDAO.updateUser(param).then(response => {
                        return res.json({user: response});
                    })
                } else {
                    UserDAO.createUser(param).then(response => {
                        console.log(response);
                        return res.json({user: response});
                    })
                }
            })
        }
    })
});

//Get a User by spotifyID
usersRouter.get('/', (req,  res) => {
    let spotifyUserId = req.query.spotifyId;
    UserDAO.getUserBySpotifyId(spotifyUserId).then(user => {
        res.json({user: user});
    })
});

//Get a User's Friends
usersRouter.get('/friends', (req,  res) => {
    let userId = req.query.userId;
    UserDAO.getfriends(userId).then((allUsers) => {
        return res.json({friends: allUsers});
    });
});

// Get a list of all users
usersRouter.get('/all', (req,  res) => {
    UserDAO.getUsers().then((allUsers) => {
        res.json({users: allUsers});
    });
});

//TESTING ROUTE
usersRouter.get('/testRelationships', (req,  res) => {
    SongDAO.allUserSongsRelationships().then((relationships) => {
        res.json({relationships: relationships});
    });
});

// check whether two users are friends
usersRouter.get('/checkfriend', (req,  res) => {
    let userId = req.query.userId;
    let friendId = req.query.friendId;

    UserDAO.checkUserFriend(userId, friendId).then((relationship) => {
        if (relationship) {
            return res.json({isFriend: true});
        } else {
            return res.json({isFriend: false});
        }
    });
});

//Get a User's Songs
usersRouter.get('/songs', (req,  res) => {
    let userId = req.query.userId;
    // test(userId).then((songs) => {
    //     return res.json({usersSongs: songs});
    // });
    SongDAO.getUsersSongs(userId).then((songs) => {
        return res.json({usersSongs: songs});
    });
});

// async function test(userId) {
//     await SongDAO.getUsersSongs(userId).then((songs) => {
//         return songs;
//     });
// }

//Get Current User's friend group's top songs artists
usersRouter.get('/topartists', (req,  res) => {
    let userId = req.query.userId;

    // Get current user's friends
    let allFriends = [];
    UserDAO.getfriends(userId).then(friends => {
        allFriends = friends;
    })

    // Get the top picks for each friend
    for (const friend of allFriends) {

    }

    res.json({message: "STILL UNDER WORK, DON'T USE THIS ENDPOINT"})
});

//Get a User's recommended new friends to follow
usersRouter.get('/newfriends', (req,  res) => {
    const userId = req.body.userId;
    let user = users.find(user => user.userId == userId);

    if(user) {
        let notFriend = {};
        for (const person of songs) {
            let found = false;
            for (const friend of user.friends) {
                if (person.userId === friend || person.userId === user.userId) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                let shared = 0;
                for (const personSong of person.songs) {
                    let song = user.songs.find(song => song === personSong);
                    if (song) {
                        shared += 1;
                    }
                }
                notFriend[person.userId] = shared;
            }
        }

        // Create array
        var recommendedArray = Object.keys(notFriend).map(function(key) {
            return [key, notFriend[key]];
        });

        // Sort the array based on the second element
        recommendedArray.sort(function(first, second) {
            return second[1] - first[1];
        });

        if (recommendedArray.length === 0) {
            res.json({recommendedFriends: "There are no new friends to recommend for you to follow on Spotify"});
        }
  
        // Create a new array with only the first 2 people
        let recommended = recommendedArray.slice(0, 2);
        res.json({recommendedFriends: recommended});
    }
    else {
      res.status(404).json({error: 'User not found'});
    }
});

//Generating playlist
usersRouter.post('/myplaylist', (req,  res) => {
    let userId = req.body.user.id;
    let spotifyId = req.body.user.spotify_id;
    let playlistName = req.body.playlistName;

    let url = "https://api.spotify.com/v1/users/" + spotifyId + "/playlists";

    let headers = {
        'Authorization': 'Bearer ' + req.cookies['spotify_access_token'],
    }

    // data to pass into creating new playlist
    let data = {
        'name': playlistName,
        'description': "Generated new Playlist.",
        'public': true
    }

    post(url, headers, data).then((fullData) => {
        var error = fullData.error || null;
        if (error) {
            console.log("error with request sent to spotify for tracks");
            console.log(error);
            return res.status(error.status).json({error: error});
        } else {
            let playlist = fullData;
            
            UserDAO.getfriends(userId).then((friends) => {

                friends.push(req.body.user);
                generateSongMap(friends).then((generatedResponse) => {
                    let songMap = generatedResponse.songMap;
                    let topRelationships = [];

                    const mapSorted = new Map([...songMap.entries()].sort((a, b) => b[1] - a[1]));


                    console.log("sorted map: " + Array.from(mapSorted.keys()));
                    console.log("sorted map: " + Array.from(mapSorted.values()));
                    
                    //take top 5 results
                    const topSongs = [];
                    let uris = [];
                    const keys = Array.from(mapSorted.keys());
                    const values = Array.from(mapSorted.values());

                    //threshold to use when picking songs based on frequency (1 - friends in group)
                    let threshold = 2;
                    console.log("friends.length " + friends.length);
                    for (let i = 0; i < keys.length; i++) {
                        if (i > 29) {
                            break;
                        }
                        if (values[i] < threshold) {
                            break;
                        }

                        let songSpotifyId = keys[i];
                        SongDAO.getSongBySpotifyId(songSpotifyId).then((song) => {
                            if (song) {
                                // add to front of array to do later
                                topSongs.unshift(song);
                                let songURI = song.uri;
                                uris.push(songURI);
                                console.log("URIs INLOOP:" + uris);
                            }
                        });

                        let data = generatedResponse.songRelationships.find(element => element.song_spotify_id === songSpotifyId);
                        topRelationships.push(data);
                    }
                
                    //add in to the playlist here
                    let trackurl = "https://api.spotify.com/v1/playlists/" + playlist.id + "/tracks";
                
                    let trackheaders = {
                        'Authorization': 'Bearer ' + req.cookies['spotify_access_token'],
                        'Content-Type': 'application/json'
                    }
                
                    // console.log("uris array: " + uris);
                    
                    post(trackurl, trackheaders, uris).then((fData) => {
                        console.log("URIs HERE:" + uris);
                        console.log("Stringified trackdata:" + JSON.stringify(uris));
                        
                        return res.json({topSongs: topSongs, response: fData, url: playlist.external_urls.spotify, relationships: topRelationships})
                    });
                });
            });
        }
    });
});

//Add a new Friend
usersRouter.post('/addFriends', (req,  res) => {
    let userId = req.body.userId;
    let friends = req.body.friends;

    console.log(friends);
    let addedFriends = [];
    for (const friend of friends) {
        if (parseInt(friend.id) != parseInt(userId)) {
            addedFriends.push(friend);
            UserDAO.createUserFriend(userId, friend.id).then((row) => {
                console.log(row);
            });
        }
    }

    return res.json({success: "added users as friends", added: addedFriends});
});

//Update Current User's Spotify info such as songs
usersRouter.put('/refresh', (req,  res) => {
    const userId = req.body.userId;

    let url = 'https://api.spotify.com/v1/me/playlists';

    let headers =  {
        'Authorization': 'Bearer ' + req.cookies['spotify_access_token']
    }

    //Make requests to get current users tracks from playlists in spotify
    let playlistHrefs = [];
    get(url, headers).then((fullData) => {
        var error = fullData.error || null;
        if (error) {
            console.log("error with request sent to spotify for tracks");
            return res.status(error.status).json({error: error});
        } else {
            for (const playlist of fullData.items) {
                playlistHrefs.push(playlist.tracks.href);
            }

            getPlaylistData(playlistHrefs, headers).then((playlistData) => {
                var error = playlistData.error || null;
                if (error) {
                    console.log("Not able to grab tracks for user");
                    return res.status(error.status).json({error: error});
                } else {
                    for (const playlist of playlistData) {
                        let tracks = playlist.items;
                        
                        for (const track of tracks) {
                            let param = {
                                name: track.track.name,
                                spotify_id: track.track.id,
                                artist: track.track.artists[0].name,
                                album: track.track.album.name,
                                uri: track.track.uri
                            }
                            
                            SongDAO.createSong(param).then((createdSong) => {
                                // console.log(param.name + " - ");
                                // console.log(createdSong);
                                if (createdSong) {
                                    createUserSongRelationship(userId, createdSong.id).then((resp) => {
                                        console.log(resp);
                                    });
                                }
                            });
                        }
                    }
                }
                
                return res.json({playlistHrefData: fullData.items, playlistData: playlistData});
            });
        }
    }).catch((err) => {
        return res.status(err.status).json({error: err});
    });
});
  
  
//Delete or remove a friend
usersRouter.delete('/removefriends', (req,  res) => {
    let userId = req.body.userId;
    let friends = req.body.friends;

    console.log(friends);
    let removedFriends = [];
    for (const friend of friends) {
        if (parseInt(friend.id) != parseInt(userId)) {
            removedFriends.push(friend);
            UserDAO.removeUserFriend(userId, friend.id).then((row) => {
                console.log("Removed FriendShip: " + row);
            });
        }
    }

    return res.json({success: "removed friends", removed: removedFriends});
});

async function generateSongMap(friends) {
    const songMap = new Map();
    let songRelationships = [];

    for (const friend of friends) {
        await SongDAO.getUsersSongs(friend.id).then((friendSongs) => {
            for (const song of friendSongs) {
                let value = songMap.get(song.spotify_id);
                if (value) {
                    value = parseInt(songMap.get(song.spotify_id));
                    songMap.set(song.spotify_id, value + 1);

                    //adding to relationships
                    for (const data of songRelationships) {
                        if (data.song_spotify_id === song.spotify_id) {
                            let userList = data.users;
                            userList.push(friend);
                            data.users = userList;
                        }
                    }
                } else {
                    songMap.set(song.spotify_id, 1);
                    
                    //adding to relationships
                    let users = []
                    let songFriendData = {
                        song_id: song.id,
                        song_spotify_id: song.spotify_id,
                        name: song.song_name,
                        users: users
                    }
                    users.push(friend);
                    songRelationships.push(songFriendData);
                }
            }
        });
    }

    // for (const friend of friends) {
    //     for (const song of songRelationships) {
    //         await SongDAO.getUserSong(friend.id)
    //     }
    // }

    let response = {
        songMap: songMap,
        songRelationships: songRelationships,
    } 

    return response;
}

async function createUserSongRelationship(userId, songId) {
    let relationship;
    await SongDAO.createUserSong(userId, songId).then((data) => {
        relationship = data;
    });
    return relationship;
}

// async function to make GET call within GET
async function getPlaylistData(playlistHrefs, headers) {
    let allResults = [];
    for (const href of playlistHrefs) {
        await get(href, headers).then((data) => {
            allResults.push(data);
        });
    }

    return allResults;
}

// async function GET to Spotify API
async function get(url, headers) {
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: headers
    });

    return response.json();
}


async function post(url, headers, data) {
    await delay(5000);
    console.log("Waited 5s");
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: headers
    });

    return response.json();
}



module.exports = usersRouter;