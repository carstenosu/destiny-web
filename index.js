const express = require('express');
const app = express();
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.set('view engine', 'pug');
app.use(express.static('assets'))
app.use(express.static('node_modules'))
app.use(require('./controllers'))

app.listen(3000, function() {
  console.log('Express is listening to http://localhost:3000');
});