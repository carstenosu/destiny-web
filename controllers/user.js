const express = require('express');
const router = express.Router();
const destiny = require('node-destiny');

const destinyClient = new destiny.DestinyClient(process.env.BUNGIE_API_KEY, 'https://www.bungie.net/platform/Destiny');

// User landing page
router.get('/user/:gamertag', function(req, res) {

  let charSummaries = [];

  destinyClient.search('1', req.params.gamertag).then( response => {

    const membership = response.data.Response[0];
    const membershipId = membership.membershipId;

    destinyClient.getAccountSummary( 1, membershipId ).then( response => {

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
            res.render('user', { characterSummaries: characterSummaries, title: `Destiny - ${req.params.gamertag}`, message: `${req.params.gamertag}` })
        })
    })
  })

})

module.exports = router