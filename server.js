const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

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

const userApi = require('./routes/user-api.js');
app.use('/api/users', userApi);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
});