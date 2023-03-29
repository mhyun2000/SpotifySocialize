import api from './APIClient.js';

const message = document.getElementById('message');

api.logOut().then(userData => {
    console.log("Logged Out");
    console.log(userData);
}).catch((err) => {
    console.log("Unsuccessful logout!");
});