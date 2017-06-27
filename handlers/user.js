const destiny = require('node-destiny');
const apiKey = process.env.BUNGIE_API_KEY;

const destinyClient = new destiny.DestinyClient(apiKey, 'https://www.bungie.net/platform/Destiny');

function loadUser( gamertag ) {
    let charSummaries = [];
    const membershipType = '1';
    let membershipId = null;
    let characterIds = [];
    let characterPromises = [];

    return destinyClient.search(membershipType, gamertag).then( response => {
        const membership = response.data.Response[0];
        membershipId = membership.membershipId;
    }).then( response => {
        return destinyClient.getAccountSummary( membershipType, membershipId ).then( response => {
            console.log('Got Membership Summary');
            const characters = response.data.Response.data.characters;
            const grimoireScore = 4615;

            destinyClient.definitions = true;

            for ( var tempChar of characters ) {
                characterIds.push(tempChar.characterBase.characterId);
                characterPromises.push(destinyClient.getCharacterSummary( membershipType, membershipId, tempChar.characterBase.characterId ));        
            }
        })
    }).then( response => {
        const params = { mode: 'Raid', count: '10', page: '0'};
        return Promise.all( characterPromises ).then( characterSummaries => {
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
                    characterResponse.gamertag = gamertag;
                    charSummaries.push(characterResponse);
                })
                return charSummaries;
        })
        
    })

}

function getCharacterSummary( gamertag, membershipType, membershipId, characterId ) {
    console.log('hander for getcharacter summary');

    destinyClient.definitions = true;

    return destinyClient.getCharacterSummary(membershipType, membershipId, characterId).then( response => {
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

        characterSummary.membershipType = membershipType;
        characterSummary.membershipId = membershipId;
        characterSummary.gamertag = gamertag;
        return characterSummary;
    })
}

function getRaidHistory( membershipType, membershipId, characterId ) {
    const params = { mode: 'Raid', count: '20', page: '0'};
    return destinyClient.getActivityHistory(membershipType, membershipId, characterId, params).then( response => {
        return response;
    });
}

module.exports.loadUser = loadUser;
module.exports.getCharacterSummary = getCharacterSummary;
module.exports.getRaidHistory = getRaidHistory;