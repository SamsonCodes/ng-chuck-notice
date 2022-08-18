const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const userApi = require('./server/routes/user-api.js');
const taskApi = require('./server/routes/task-api.js');
const assignmentApi = require('./server/routes/assignment-api.js');
const dependencyApi = require('./server/routes/dependency-api.js');

require('dotenv').config();

const app = express();
const port = 3000;

const db_url = process.env.DB_URL;
mongoose.connect(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function(err){
  if(err){
    console.log(err);
  } else {
    console.log('Successfully connected to the database.' + db_url);
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:4200'}));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
require('./server/config/passport')(passport);

app.use(passport.initialize());



/**
 * -------------- ROUTES ----------------
 */
app.use('/api/users', userApi);
app.use('/api/tasks', taskApi);
app.use('/api/assignments', assignmentApi);
app.use('/api/dependencies', dependencyApi);

app.get('/', (req, res)=>{
  res.send('Hello World');
})

app.get('/api/loggedin', function (req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { 
      console.log(err); 
      res.send({msg: err})
    } 
    else{
      res.send({msg: 'Logged out user.'});
    }       
  });
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
});