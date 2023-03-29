# [Spotify Socialize]
## Group [J]: Spotify Socialize Final Project

## What is Done:
The welcome page and the home page are created according to the wireframes. The authentication has been established and now users are able to login and create an account utilizing the Spotify API tool. The welcome, home, contact, about, and logout pages have been created and the front end has been fully developed on these pages. There also has been a redesign on the webpages. The API requests are working and the frontend is connected to the backend. The database has been created and is setup and the tables have been fully populated.

## What is Not Done:
The PWA has not been complete and the service worker is still in progress.

## List of all the pages in the application and how to navigate them:
Login Page: This is the first page that is displayed to the user. When the user clicks the login button, they are prompted to
enter their credentials. Once they do that, they are automatically navigated to the HomePage.
HomePage:  This is the page that the users are sent to after they enter their credentials. There is a navigation bar at the top where they can 
access the Content Page, The About Page, and the Logout Page. This page has been revised and the functionalities have been fully complete.
Contact Page:  This is the page that displays the contact information. This page is accessed through the navigation bar at the top. This page has been
revised and the functionalities have been fully complete.
About Page: This is the page that displays the about information. This page is accessed through the navigation bar at the top. This page has been
revised and the functionalities have been fully complete.
Logout Page:  This is the page that is shown when the user logs out. This page is accessed through the navigation bar at the top. This page has been
revised and the functionalities have been fully complete.


## Description of Authentication and Authorization Process: 
This process uses the Spotify API where the individuals will be able to login through the Spotify OAuth.


## Links to wireframes for the pages that are not yet complete


## List of all API endpoints with behavior description
https://localhost/api/users/ -> This is the basepath for all user related routes
https://localhost/api/users/friends -> This is going to retrieve all of the specified user's friends
https://localhost/api/users/all -> This is going to retrieve all users in the system
https://localhost/api/users/checkfriend -> This is going check the relationship between two users and see if they are friends
https://localhost/api/users/addFriends -> This is going to add a user as a friend to the current user
https://localhost/api/users/removefriends -> This is going to remove a friend from current user
https://localhost/api/users/songs -> This is going to retrieve all of the songs of the specified user
https://localhost/api/users/myplaylist -> This is going to generate the playlist for the user after analyzing songs of friends
https://localhost/api/users/me -> This is going to get the current user and update the user's information
https://localhost/api/users/refresh -> This is going to pull the current user's most recent songs from Spotify
https://localhost/api/auth/ -> This is the basepath for all authentication related routes
https://localhost/api/auth/callback -> This is the endpoint that Spotify uses to redirect users to our webapp
https://localhost/api/auth/refresh_token -> This grabs the refresh token when the access token has expired
https://localhost/api/auth/logout -> This is the route for logging the user out


## Individual Team Member Contributions
Joel: Worked on the Backend and the API requests -> Worked on the authentication and connecting to the backend
Minho: Worked on the authentication and connecting to the backend
Srisheel: Worked on the Frontend Basic Development of the Home, Contact, About, Logout pages
