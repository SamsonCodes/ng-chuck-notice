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
const utils = require('./server/lib/utils');

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