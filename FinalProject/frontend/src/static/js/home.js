import api from './APIClient.js';

//Service worker check
if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/serviceWorker.js')
            .then(reg => console.log('Service Worker: Registered'))
            .catch(err => console.log(`Service Worker: Error: ${err}`))
    })
}

const aboutButton = document.getElementById('about');
const contactButton = document.getElementById('contact');
const logoutButton = document.getElementById('logout');
const header = document.getElementById('header');

//tile object parents
let usersDiv = document.getElementById('users');
let addedUsersDiv = document.getElementById('addedUsers');
let generatedPlaylistDiv = document.getElementById('generatedPlaylist');

let currentUser;
let allUsers;

let friendsToAdd = [];
let removedFriends = [];

// Grabs current user info
api.getCurrentUser().then((userData) => {
    header.innerHTML = `Welcome, ${userData.user.name}`
    currentUser = userData.user;
    console.log("CurrentUser:");
    console.log(currentUser);

    // retrieve all friends
    api.getUserFriends(currentUser.id).then((friendsData) => {
        friendsToAdd = friendsData.friends;
        console.log(friendsData.friends);

        //add tiles for each user
        for (const user of friendsData.friends) {
            let newTile = document.createElement('div');
            newTile.textContent = user.name + " - (" + user.email + ")";
            newTile.className = 'tile';
            addedUsersDiv.appendChild(newTile);

            newTile.addEventListener('click', e => {
                try { //remove from friends
                    addedUsersDiv.removeChild(newTile);
                    usersDiv.appendChild(newTile);

                    //remove friend
                    removedFriends.push(user);

                    console.log("Removed a friend:");
                } catch { //add back to friends
                    usersDiv.removeChild(newTile);
                    addedUsersDiv.appendChild(newTile);
                    
                    //remove friend code
                    const index = removedFriends.indexOf(user);
                    if (index > -1) {
                        removedFriends.splice(index, 1); 
                    }

                    console.log("Added a Friend back:");
                }
            });
        }
    }).catch((err) => {
        console.log(err);
    });

    // retrieve all users in application
    api.getAllUsers().then((usersData) => {
        allUsers = usersData.users;
        console.log(usersData.users);

        //add tiles for each user
        for (const user of usersData.users) {
            api.getRelationship(currentUser.id, user.id).then((relationship) => {
                console.log("User being checked against:");
                if (!relationship.isFriend && (user.id != currentUser.id)) {
                    let newTile = document.createElement('div');
                    newTile.textContent = user.name + " - (" + user.email + ")";
                    newTile.className = 'tile';
                    usersDiv.appendChild(newTile);
        
                    newTile.addEventListener('click', e => {
                        try { //add
                            usersDiv.removeChild(newTile);
                            addedUsersDiv.appendChild(newTile);
                            friendsToAdd.push(user);
        
                            console.log("Added a new friends:");
                        } catch { //remove
                            addedUsersDiv.removeChild(newTile);
                            usersDiv.appendChild(newTile);
                            
                            const index = friendsToAdd.indexOf(user);
                            if (index > -1) {
                                friendsToAdd.splice(index, 1); 
                            }
        
                            console.log("removed a new friend:");
                        }
                    });
                }
            });
        }
    }).catch((err) => {
        console.log(err);
    });
    
    // update the current users info
    api.updateCurrentUser(currentUser.id).then((response) => {
        console.log("Update from spotify successful");
        console.log(response);
    
        api.getUserSongs(currentUser.id).then((songData) => {
            console.log("The Current User's Songs:");
            console.log(songData);
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
}).catch((err) => {
  header.innerHTML = "You are not authenticated, please login again."
  console.log(err);
});

api.getAllSongRelationships().then((relationships) => {
    console.log(relationships);
});




//generate playlist
let generateButton = document.getElementById('generateButton');
let textbox = document.getElementById('playlistname');

//view playlist in spotify
let viewButton = document.getElementById('viewPlaylist');
viewButton.style.visibility = 'hidden';

let songAnalysiDiv = document.getElementById('comparisonBottom');
let songTitle = document.getElementById('songTitle');
let songAnalysisContent = document.getElementById('friendsWithSong');

let anotherPlaylist = document.getElementById('anotherPlaylist');

generateButton.addEventListener('click', e => {
    //first add all relationships
    api.addFriends(currentUser.id, friendsToAdd).then((response) => {
        console.log(response);
    });

    //then remove friends if any
    api.removefriends(currentUser.id, removedFriends).then((response) => {
        console.log(response);
    });

    //make the api call to generate
    api.createMyPlaylist(currentUser, textbox.value).then((createdPlaylist) => {
        console.log(createdPlaylist);
        let playlist = createdPlaylist.topSongs;
        let playlistUrl = createdPlaylist.url;
        let relationships = createdPlaylist.relationships;

        
        viewButton.addEventListener('click', e => {
            window.open(playlistUrl, '_blank');
        });

        // now add elements to display playlist
        for (const song of playlist) {
            let data = relationships.find(element => element.song_spotify_id === song.spotify_id);
            let newTile = document.createElement('div');
            newTile.textContent = song.name;
            newTile.className = 'tile';
            generatedPlaylistDiv.appendChild(newTile);

            newTile.addEventListener('click', e => {
                songTitle.innerHTML = song.name;
                songAnalysisContent.innerHTML = "";

                for (const friend of data.users) {
                    let friendTile = document.createElement('div');
                    friendTile.textContent = friend.name + " - (" + friend.email + ")";;
                    friendTile.className = 'tile';
                    songAnalysisContent.appendChild(friendTile);
                }
            });
        }

        //clear textbox for next input and show button
        textbox.value = "";
        songAnalysiDiv.style.visibility = 'visible';
        viewButton.style.visibility = 'visible';
        anotherPlaylist.style.visibility = 'visible';
    }).catch((err) => {
        console.log(err);
    });
});

anotherPlaylist.addEventListener('click', e => {
    document.location = "/home";
});

aboutButton.addEventListener('click', e => {
    console.log("clicked");
    document.location.reload();
});

contactButton.addEventListener('click', e => {
    document.location = "/contact";
});

logoutButton.addEventListener('click', e => {
    document.location = "/logout";
});

