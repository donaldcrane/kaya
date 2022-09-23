# KAYA

[![Node.js CI](https://github.com/donaldcrane/kaya/actions/workflows/.node.js.yml/badge.svg)](https://github.com/donaldcrane/kaya/actions/workflows/.node.js.yml)

[![Coverage Status](https://coveralls.io/repos/github/donaldcrane/kaya/badge.svg?branch=main&service=github)](https://coveralls.io/github/donaldcrane/kaya?branch=main)

[![Maintainability](https://api.codeclimate.com/v1/badges/606d77ff293c4652107d/maintainability)](https://codeclimate.com/github/donaldcrane/kaya/maintainability)

link to the app Heroku url: [Hekoku url](https://donald-kaya.herokuapp.com)

Kaya is a RESTful API service for a Beauty Parlour app

# Documentation

A detailed documentation of the api can be found here: [API Documentation](https://documenter.getpostman.com/view/11971882/2s7ZLhpBzj)

**Run Project Locally**

- Clone the project
- cd into the project's folder and run npm install to install dependencies
- Create a .env file check the .env.sample for the keys variables

- Run npm run seed to seed data into the database
- Run npm run dev to start the server

# HTTP Requests

All API requests are made by sending a secure HTTPS request using one of the following methods:

- POST Create a resource
- GET Get a resource or list of resources
- PATCH updates a resource or list of resources
- DELETE deletes a resource or list of resources
- For POST, the body of your request must be a JSON payload.

# HTTP Response Codes

Each response will be returned with one of the following HTTP status codes:

- 200 OK Successful request
- 400 Bad Request There was a problem with the request
- 500 Server Error Server error
