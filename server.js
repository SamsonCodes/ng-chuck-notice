const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const userApi = require('./server/routes/user-api.js');
const taskApi = require('./server/routes/task-api.js');
const assignmentApi = require('./server/routes/assignment-api.js');

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

app.use('/api/users', userApi);
app.use('/api/tasks', taskApi);
app.use('/api/assignments', assignmentApi);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
});