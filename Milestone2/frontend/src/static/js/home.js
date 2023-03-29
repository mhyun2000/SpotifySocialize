import api from './APIClient.js';

const aboutButton = document.getElementById('about');
const contactButton = document.getElementById('contact');
const logoutButton = document.getElementById('logout');

api.getCurrentUser().then(userData => {
    console.log(userData);
}).catch((err) => {
  console.log(err);
});

aboutButton.addEventListener('click', e => {
    document.location = "/about";
});

contactButton.addEventListener('click', e => {
    document.location = "/contact";
});

logoutButton.addEventListener('click', e => {
    document.location = "/logout";
});

