const destiny = require('node-destiny');
const apiKey = process.env.BUNGIE_API_KEY;

const destinyClient = new destiny.DestinyClient(apiKey, 'https://www.bungie.net/platform/Destiny');

function getCharacterSummary( req, res ) {
    console.log('hander for getcharacter summary');

    destinyClient.definitions = true;

    return destinyClient.getCharacterSummary(req.params.membershipType, req.params.membershipId, req.params.characterId).then( response => {
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
        return characterSummary;
    })
}

module.exports.getCharacterSummary = getCharacterSummary;