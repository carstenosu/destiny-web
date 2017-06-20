const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.use(express.static('assets'))
app.use(require('./controllers'))

app.listen(3000, function() {
  console.log('Express is listening to http://localhost:3000');
});