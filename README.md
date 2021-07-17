# Basic MEAN stack authentication app

### Technology
* MongoDB
* Express.js
* Angular 11
* Node.js

### Deployment
Hosted on Heroku at https://gentle-chamber-43190.herokuapp.com

### Functionality
- User registration and validation
  - Async calls to ensure user registers a username and e-mail not in use.
- User authentication utilising JWT tokens (with short-lived access token and long-lived refresh token). 
- Protected routes using CanActivate guards
- Basic profile to display user information
- The system caters for silent refresh of access tokens using an Angular Http Interceptor. If the user’s access token is expired, but their refresh token is not, a request will be made to grant a new access token to access protected resources.
