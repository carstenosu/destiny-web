const express = require('express');
const router = express.Router();
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
})

// User landing page
router.get('/user/:gamertag', function(req, res) {

  let charSummaries = [];
  const membershipType = '1';

  destinyClient.search(membershipType, req.params.gamertag).then( response => {

    const membership = response.data.Response[0];
    const membershipId = membership.membershipId;

    destinyClient.getAccountSummary( membershipType, membershipId ).then( response => {

      console.log('Got Membership Summary');
        const characters = response.data.Response.data.characters;
        const grimoireScore = 4615;

        destinyClient.definitions = true;

        const characterId1 = characters[0].characterBase.characterId;
        const characterId2 = characters[1].characterBase.characterId;
        const characterId3 = characters[2].characterBase.characterId;

        const params = { mode: 'Raid', count: '10', page: '0'};

        const characterSummary1Promise = destinyClient.getCharacterSummary( membershipType, membershipId, characterId1 );
        const characterSummary2Promise = destinyClient.getCharacterSummary( membershipType, membershipId, characterId2 );
        const characterSummary3Promise = destinyClient.getCharacterSummary( membershipType, membershipId, characterId3 );

        Promise.all( [characterSummary1Promise, characterSummary2Promise, characterSummary3Promise]).then( characterSummaries => {
            
            characterSummaries.forEach( characterSummary => {
                const characterResponse = characterSummary.data.Response.data
                const definitions = characterSummary.data.Response.definitions;

                const genderHash = characterResponse.characterBase.genderHash;
                const raceHash = characterResponse.characterBase.raceHash;
                const classHash = characterResponse.characterBase.classHash;

                const genderName = definitions.genders[genderHash].genderName;
                const raceName = definitions.races[raceHash].raceName;
                const className = definitions.classes[classHash].className;

                characterResponse.characterBase.genderName = genderName;
                characterResponse.characterBase.raceName = raceName;
                characterResponse.characterBase.className = className;

                charSummaries.push(characterResponse);
            })
            
            
            res.render('user', { characterSummaries: charSummaries, title: `Destiny - ${req.params.gamertag}`, message: `${req.params.gamertag}` })
        })
    })
  })

})

module.exports = router