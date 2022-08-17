const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const crypto = require('crypto');

const MongoStore = require('connect-mongo');

const userApi = require('./server/routes/user-api.js');
const taskApi = require('./server/routes/task-api.js');
const assignmentApi = require('./server/routes/assignment-api.js');
const dependencyApi = require('./server/routes/dependency-api.js');

const isAuth = require('./server/routes/authMiddleware').isAuth;
require('dotenv').config();

const app = express();
const port = 3000;

const db_url = 'mongodb://localhost:27017/chuckDB'
mongoose.connect(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function(err){
  if(err){
    console.log(err);
  } else {
    console.log('Successfully connected to the database.');
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:4200'}));

/**
 * -------------- SESSION SETUP ----------------
 */
const sessionStore = MongoStore.create({mongoUrl: db_url});

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // Equals 1 day
  }
}));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
require('./server/config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});


/**
 * -------------- ROUTES ----------------
 */
app.use('/api/users', userApi);
app.use('/api/tasks', taskApi);
app.use('/api/assignments', assignmentApi);
app.use('/api/dependencies', dependencyApi);

app.get('/protected-route', isAuth, (req, res) => {
  res.send('You are logged in.<a href="/logout">logout</a>');
});

app.get('/', (req, res)=>{
  res.send('Hello World');
})

// When you visit http://localhost:3000/login, you will see "Login Page"
app.get('/login', (req, res, next) => {
   
  const form = '<h1>Login Page</h1><form method="POST" action="api/users/login">\
  Enter Username:<br><input type="text" name="name">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);

});

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { 
      console.log(err); 
    }    
    res.redirect('/protected-route');
  });
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
});