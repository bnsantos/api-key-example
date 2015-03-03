var express = require('express')
  , passport = require('passport')
  , LocalStrategy = require('passport-localapikey').Strategy

var users = [
  {id:1, username:'John Doe', apiKey:'asd'}
]

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByApiKey(apikey, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.apikey === apikey) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


passport.serializeUser(function(user, done){
  console.log('aki')
  done(null, user.id)
})

passport.deserializeUser(function(id, done){
  console.log('aki2')
  findById(id, function(err, user){
    done(err, user)
  })
})

passport.use(new LocalStrategy( function(apiKey, done){
  process.nextTick(function(){
    console.log('localstrategy:'+apiKey)
    findByApiKey(apiKey, function(err, user){
      if(err){return done(err)}
      if(!user){return done(null, false, {message: 'Unknown apiKey: '+apiKey})}
      return done(null, user)
    })
  })
}))

function isAuth(req, res, next){
  console.log('Auth:'+req.isAuthenticated())
  console.log('apikey:'+req.headers['apikey'])
  if(req.isAuthenticated()){return next()}
  res.redirect('/')
}

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
 */
app.get('/auth', isAuth, function(req, res){
  res.send({message: 'Hello world Auth', auth: ''})
})

/*
 * Get authentication required
 */
app.post('/auth', isAuth, function(req, res){
  res.send({message: 'Hello world Auth', auth: ''})
})


app.get('/', function(req, res){
  res.send('You need to be auth')
})

app.post('/api/authenticate',
  passport.authenticate('localapikey', { failureRedirect: '/api/unauthorized'}),
  function(req, res) {
     res.json({ message: "Authenticated" })
})
