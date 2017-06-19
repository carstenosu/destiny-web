const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.use(express.static('assets'))

app.get('/', function (req, res) {
  res.render('index', { title: 'Destiny', message: 'Enter Gamertag' })
})

app.listen(3000, function() {
  console.log('Express is listening to http://localhost:3000');
});