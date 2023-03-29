// code to sort an array inspired by this post on stack overflow: https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript

const express = require('express');
const usersRouter = express.Router();

usersRouter.use(express.json())

let users = require('../data/users.json');

// Contains the songs for associated with each userid. The userId may not have been an active user of the application
// and could simply be a friend of a user.
let songs = require('../data/songs.json');

//Get a User
usersRouter.get('/', (req,  res) => {
    const userId = req.body.userId;
    let user = users.find(user => user.userId == userId);
    if(user) {
      res.json(user);
    }
    else {
      res.status(404).json({error: 'User not found'});
    }
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
//Get a User's friend group's top 5 songs and top 5 artist
usersRouter.get('/toppicks', (req,  res) => {
    const userId = req.body.userId;
    let user = users.find(user => user.userId == userId);

    if(user) {
        let friendSongList = [];
        for (const friend of user.friends) {
            let friendData = songs.find(person => person.userId === friend);
            for (const song of friendData.songs) {
                friendSongList.push(song);
            }
        }

        const songCount = {};

        for (const num of friendSongList) {
            songCount[num] = songCount[num] ? songCount[num] + 1 : 1;
        }

        // Create array
        var songArray = Object.keys(songCount).map(function(key) {
            return [key, songCount[key]];
        });
  
        // Sort the array based on the second element
        songArray.sort(function(first, second) {
            return second[1] - first[1];
        });
  
        // Create a new array with only the first 5 items
        let topPicks = songArray.slice(0, 5);
        res.json({topPicks: topPicks})
    }
    else {
        res.status(404).json({error: 'User not found'});
    }
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

module.exports = usersRouter;