# Dans Javascript API

A simple API made with NodeJS using Express.

## Important credit

When I was learning how to put an API together in this manner, I followed this guide: https://www.toptal.com/nodejs/secure-rest-api-in-nodejs

I used his skeleton as a starting point and I modified it over time to serve my needs.

A couple of big differences are that I use bcrypt for hashing and I create my refresh token and my access token in two separate middleware functions.