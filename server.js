const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const axios = require('axios');

const userApi = require('./server/routes/user-api.js');
const taskApi = require('./server/routes/task-api.js');
const assignmentApi = require('./server/routes/assignment-api.js');
const dependencyApi = require('./server/routes/dependency-api.js');
const utils = require('./server/lib/utils');
const Joke = require('./server/models/joke');

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

/**
 * -------------- TASK MONITORING ----------------
 */
checkOverdueTasks();
//  setInterval(checkOverdueTasks, 24*60*60*1000); //every day
setInterval(checkOverdueTasks, 60*1000); //every minute

setDailyJoke();
 
function checkOverdueTasks(){  
  console.log('Checking overdue tasks');
  
  let today = new Date();
  today.setDate(today.getDate());
  let todayString = utils.convertToDateString(today);
  console.log('Today: ' + todayString); 

  const Task = require('./server/models/task');  
  Task
    .find({deadline: {$lt: todayString, $ne: ''}})
    .exec(async function (err, overdueTasks) {
        if (err) {
          console.log(err);
        } else {  
          console.log('Overdue tasks: ' + String(overdueTasks.length));
          for(const overdueTask of overdueTasks) {
            const result = await penalizeAssignedUsers(overdueTask);
            console.log(overdueTask.title, result);
            overdueTask.deadline = 'OVERDUE';
            overdueTask.save();
          }
        }        
    });
}

function penalizeAssignedUsers(overdueTask){
  const Assignment = require('./server/models/assignment');
  const User = require('./server/models/user');
  let promise = new Promise(function(resolve){
    Assignment.find({task_id: overdueTask._id}).then(assignments => {
      userCalls = [];
      assignments.forEach(assignment => {
        userCalls.push(User.findById(assignment.user_id))
      })
      Promise.all(userCalls).then(users=>{
        let names = [];
        let penalties = [];
        users.forEach(user => {
          user.penalties += 1;
          if(user.userGroup == 'master'){
            user.penalties = 0;
          }
          user.save();
          names.push(user.name);
          penalties.push(user.penalties);
        })
        resolve([names, penalties]);
      })      
    })
  })
  return promise;
}

function setDailyJoke(){
  axios.get('https://api.chucknorris.io/jokes/random')
  .then(response => {
    let newJoke = response.data.value;    
    
    console.log('newJoke:' + newJoke);    
    Joke.find({}, (error, jokes)=>{
      if(jokes.length == 0){ 
        //If there is no joke in the database yet, add it.
        newJokeData = new Joke({joke: newJoke});
        newJokeData.save();
        console.log('Added joke to database.');
      } else { 
        //If there already is one, change it.
        jokes[0].joke=newJoke;
        jokes[0].save();
        console.log('Changed joke in database.');
      }
      if(error){
        console.log(error);
      }
    })
  })
  .catch(error => {
    console.log(error);
  });

  app.get('/api/daily-joke', function(req, res){
    Joke.find((error, jokes)=>{
      if(error){
        console.log(error);
        res.end("Server error: " + err.toString());
      } else {
        let joke = jokes[0].joke;
        res.json({'joke': joke});
      }      
    })
  })
}