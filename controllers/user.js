const express = require('express');
const router = express.Router();

const userHandler = require('../handlers/user.js');

const destiny = require('node-destiny');
const apiKey = process.env.BUNGIE_API_KEY;

const destinyClient = new destiny.DestinyClient(apiKey, 'https://www.bungie.net/platform/Destiny');

router.post('/user', function(req,res){
  console.log('form submitted');
  const gamertag = req.body.gamertag;
  if ( gamertag ) {
    res.redirect('/user/'+gamertag);
  } else {
    res.redirect('/error');
  }
});

router.get('/user/:gamertag/:membershipType/:membershipId/:characterId', function(req, res){
  const characterSummaryPromise = userHandler.getCharacterSummary(req.params.membershipType, req.params.membershipId, req.params.caharcterId).then( response => {
    res.render('character', { characterSummary: response, title: `Destiny - ${req.params.gamertag}`})
  });
  
});

// User landing page
router.get('/user/:gamertag', function(req, res) {
  const userPromise = userHandler.loadUser(req.params.gamertag).then( response => {
    res.render('user', { characterSummaries: response, title: `Destiny - ${req.params.gamertag}`, message: `${req.params.gamertag}` })
  })
})

module.exports = router