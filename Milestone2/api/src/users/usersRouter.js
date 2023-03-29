const express = require('express');
const cors = require('cors');  // Allows a server to indivate any origins https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
const cookieParser = require('cookie-parser'); // cookie-parser module, install using npm?
const usersRouter = express.Router();

usersRouter.use(express.json())
    .use(cors()) // added usage of cors
    .use(cookieParser()); // added usage of cookieParser

const UserDAO = require('../data/UserDAO');

// Contains the songs for associated with each userid. The userId may not have been an active user of the application
// and could simply be a friend of a user.

//Get Current User Profile
usersRouter.get('/me', (req,  res) => {
    let url = 'https://api.spotify.com/v1/me';

    headers =  {
        'Authorization': 'Bearer ' + req.cookies['spotify_access_token']
    }

    get(url, headers).then((data) => {
        console.log(data);
        var error = data.error || null;
        if (error) {
            res.status(error.status).json({error: error});
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

            UserDAO.getUserBySpotifyId(data.id).then(user => {
                if (user) {
                    UserDAO.updateUser(param).then(response => {
                        res.json(response);
                    })
                } else {
                    UserDAO.createUser(param).then(response => {
                        res.json(response);
                    })
                }
            })
        }
    })
});

//Get a User Profile
usersRouter.get('/', (req,  res) => {
    let spotifyUserId = req.params.spotifyUserId;
    UserDAO.getUserBySpotifyId(spotifyUserId).then(user => {
        if (user) {
            res.json(user);
        } else { //create new if user is not already in the database
            let url = 'https://api.spotify.com/v1/users/' + spotifyUserId;

            headers =  {
                'Authorization': 'Bearer ' + req.cookies['spotify_access_token']
            }
        
            get(url, headers).then((data) => {
                let param = {
                    name: data.display_name,
                    spotify_id: data.id,
                    email: data.email,
                    country: data.country,
                    followers: data.followers.total
                }

                var error = data.error || null;
                if (error) {
                    res.status(error.status).json({error: error});
                } else {
                    UserDAO.createUser(param).then(response => {
                        res.json(response);
                    })
                }
            })
        }
    })
});

//Get a User's Friends
usersRouter.get('/friends', (req,  res) => {
    const userId = req.body.userId;
    let user = users.find(user => user.userId == userId);
    if(user) {
      res.json(user.friends);
    }
    else {
      res.status(404).json({error: 'User not found'});
    }
});

//Get a User's Songs
usersRouter.get('/songs', (req,  res) => {
    const userId = req.body.userId;
    let user = users.find(user => user.userId == userId);
    if(user) {
      res.json(user.songs);
    }
    else {
      res.status(404).json({error: 'User not found'});
    }
});

//Get a User's friend group's top songs artists
usersRouter.get('/toppicks', (req,  res) => {
    //For now this api simply returns the current users top items from spotify
    //In the future this will include logic to compare between a group of friends and find the top 5 songs and top 5 artists
    //TOBE added
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
  
//Create a new User
usersRouter.post('/new', (req,  res) => {
    let newUser = req.body;
    if (req.body === null || req.body.userId === null || req.body.songs === null) {
        res.json({error: "Invalid new User, missing fields"});
    }
    for (const user of users) {
        if (user.userId === req.body.userId) {
            res.json({error: "This user already exists"});
        }
    }
    users.push(newUser);
    res.json({success: `UserId: ${newUser.userId} added to dataset`});
});

//Update a User's Spotify info including Songs and Friends that are stored in the application
usersRouter.put('/refresh', (req,  res) => {
    const userId = req.body.userId;

    //update by pulling data from spotify

    res.json({success: `Updated UserId: ${userId}`, status: "This endpoint will update the data pulled from spotify for a users list of songs and friends. However no spotify backend logic has been added yet."});
});
  
  
//Delete a User
usersRouter.delete('/', (req,  res) => {
    const userId = req.body.userId;

    users = users.filter(user => user.userId !== userId);
    res.json({success: `${userId} has been deleted`, updatedData: users});
});


// async function to retrieve access token and refresh token
async function get(url, headers) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: headers
    });

    return response.json();
}


module.exports = usersRouter;