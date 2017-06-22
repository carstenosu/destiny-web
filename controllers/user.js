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
});

router.get('/user/:gamertag/:membershipType/:membershipId/:characterId', function(req, res){

  destinyClient.definitions = true;

  destinyClient.getCharacterSummary(req.params.membershipType, req.params.membershipId, req.params.characterId).then( response => {
    const characterSummary = response.data.Response.data;
    const definitions = response.data.Response.definitions;
    const genderHash = characterSummary.characterBase.genderHash;
    const raceHash = characterSummary.characterBase.raceHash;
    const classHash = characterSummary.characterBase.classHash;

    const genderName = definitions.genders[genderHash].genderName;
    const raceName = definitions.races[raceHash].raceName;
    const className = definitions.classes[classHash].className;

    characterSummary.characterBase.genderName = genderName;
    characterSummary.characterBase.raceName = raceName;
    characterSummary.characterBase.className = className;

    characterSummary.membershipType = req.params.membershipType;
    characterSummary.membershipId = req.params.membershipId;
    characterSummary.gamertag = req.params.gamertag;
    res.render('character', { characterSummary, title: `Destiny - ${req.params.gamertag}`})
  })
});

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

                characterResponse.membershipType = membershipType;
                characterResponse.membershipId = membershipId;
                characterResponse.gamertag = req.params.gamertag;
                charSummaries.push(characterResponse);
            })
            
            
            res.render('user', { characterSummaries: charSummaries, title: `Destiny - ${req.params.gamertag}`, message: `${req.params.gamertag}` })
        })
    })
  })

})

module.exports = router