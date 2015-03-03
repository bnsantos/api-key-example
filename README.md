## Local API Key Example

This simple NodeJS application has only two mehtods

```GET /noauth```
```GET /auth```

To successfully ```GET /auth``` you need to add ```?access_token=[token]```

To run 
```
npm install
node index.js
curl -v http://localhost:3000/auth?access_token=asdfgh
```

#### Using
[express](http://expressjs.com/)<br>
[passportjs](http://passportjs.org/)<br>
[passport-http-bearer](https://github.com/jaredhanson/passport-http-bearer)

