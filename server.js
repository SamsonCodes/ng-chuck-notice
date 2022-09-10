const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');

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
    console.log('Successfully connected to the database: ' + db_url);
  }
});

setInterval(checkDeadlines, 3000);

function checkDeadlines(){
  function convertToDateString(dateObject){
    var dd = String(dateObject.getDate()).padStart(2, '0');
    var mm = String(dateObject.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = dateObject.getFullYear();
  
    var dateString = yyyy + '-' + mm + '-' + dd;
    return dateString;
  }
  console.log('Checking deadlines');
  let today = new Date();
  let todayString = convertToDateString(today);
  console.log(todayString); 
  const Task = require('./server/models/task');
  Task
    .find({deadline: {$lte: todayString, $ne: ''}})
    .exec(function (err, overdueTasks) {
        if (err) {
          console.log(err);
        } else {
          console.log(overdueTasks.length);
        }        
    });
}

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
app.use(express.static(path.join(__dirname, 'dist/chuck-notice'))); //Use the Angular app

app.use('/api/users', userApi);
app.use('/api/tasks', taskApi);
app.use('/api/assignments', assignmentApi);
app.use('/api/dependencies', dependencyApi);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
});