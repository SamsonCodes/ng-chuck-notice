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
const { AotCompiler } = require('@angular/compiler');

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

checkDeadlines();
// setInterval(checkDeadlines, 24*60*60*1000); //every day
setInterval(checkDeadlines, 60*1000); //every minute

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
  today.setDate(today.getDate());
  let todayString = convertToDateString(today);
  console.log(todayString); 
  const Task = require('./server/models/task');  
  Task
    .find({deadline: {$lt: todayString, $ne: ''}})
    .exec(async function (err, overdueTasks) {
        if (err) {
          console.log(err);
        } else {  
          console.log('overdue tasks:', overdueTasks.length);
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
  let promise = new Promise(function(resolve, reject){
    Assignment.find({task_id: overdueTask._id}).exec(function(err, assignments){
      userCalls = [];
      assignments.forEach(assignment => {
        userCalls.push(User.findById(assignment.user_id))
      })
      Promise.all(userCalls).then(users=>{
        let names = [];
        let penalties = [];
        users.forEach(user=>{
          user.penalties += 1;
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