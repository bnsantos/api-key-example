var express = require('express')
  , passport = require('passport')
  , BearerStrategy = require('passport-http-bearer').Strategy

var users = [
  {id:1, username:'John Doe', token:'asdfgh'}
]

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByToken(token, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.token === token) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.use(new BearerStrategy({}, function(token, done){
  process.nextTick(function(){
    findByToken(token, function(err, user){
      if(err){ return done(err) }
      if(!user){ return done(null, false) }
      return done(null, user)
    })
  })
}))

var app = express()
app.use(passport.initialize())
app.use(passport.session())

var server = app.listen(3000, function(){
  console.log('Listening at http://%s:%s', server.address().address, server.address().port)
})

/*
 * Get no authentication required
 */
app.get('/noauth', function(req, res){
  res.send({message: 'Hello world not auth'})
})


/*
 * Get authentication required
 *  http://localhost:3000/login?access_token=asdfgh
 */
app.get('/auth', passport.authenticate('bearer', {session:false}), function(req, res){
  res.send({message: 'Hello world '+ req.user.username, auth: 'you\'re logged'})
})
