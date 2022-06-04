function selectFighter(tabFighters, rankCharacterChosen) {
  //First, check if the characters are available to play (time)
  let availableCharacters = tabFighters.filter((oneCharacter) => {
    return characterPlayable(oneCharacter);
  });

  // Second, get all characters with the same rank.
  let sameRankCharacters = availableCharacters.filter((oneCharacter) => {
    return oneCharacter.rank === rankCharacterChosen;
  });
  // If there is just one character with the same rank, return it
  if (sameRankCharacters.length === 1) {
    return {
      err: null,
      success: true,
      result: sameRankCharacters[0],
    };

    // If some characters have the same rank :
  } else if (sameRankCharacters.length > 0) {
    // Return the character with the lowest number of fights
    let result = getLowestCharacterWithNumberOfFights(sameRankCharacters);
    return {
      err: null,
      success: true,
      result: result,
    };
  }

  // If no character have the same rank, return the character with closest ranks
  return {
    err: null,
    success: true,
    result: getClosestRankCharacter(availableCharacters),
  };
}

// Return boolean if the character is playable or not.
function characterPlayable(character) {
  if (character.statusLastFight) {
    return true;
  }

  const dateNow = new Date();
  const dateCharacter = new Date(character.dateLastFight);
  const differenceMinutes = new Date(dateNow - dateCharacter).getMinutes();

  if (!character.statusLastFight && differenceMinutes < 60) {
    return true;
  } else {
    return false;
  }
}
// Return the character with the lowest number of fights OR a random.
function getLowestCharacterWithNumberOfFights(characters) {
  let finalCharacter;
  //Check minimum of fights in the array.
  let minNumberOfFights = Math.min(
    ...characters.map((item) => item.numberFights)
  );

  // Filter characters with the minimum of number of fights
  let lowestsCharacterWithNumberOfFights = characters.filter(
    (character) => (character.numberFights = minNumberOfFights)
  );

  //Check number of characters
  if (lowestsCharacterWithNumberOfFights.length > 1) {
    //Random choice if various characters
    let indexCharacter = Math.floor(
      Math.random() * lowestsCharacterWithNumberOfFights.length
    );
    finalCharacter = lowestsCharacterWithNumberOfFights[indexCharacter];
  } else {
    // Return character with lowest number of fights if just one
    finalCharacter = lowestsCharacterWithNumberOfFights[0];
  }

  return finalCharacter;
}

// Return the character with the closest rank, and lowest number of fights or random.
function getClosestRankCharacter(characters, rankCharacter) {
  let finalCharacter;

  // Filter characters with closest ranks.
  let closestsCharactersRank = characters.filter(
    (characterPrev, characterCurr) => {
      return Math.abs(characterCurr.rank - rankCharacter) <
        Math.abs(characterPrev.rank - rankCharacter)
        ? characterCurr.rank
        : characterPrev.rank;
    }
  );

  // if there are various characters closest to the current rank, check the lowest number of fights
  if (closestsCharactersRank.length > 1) {
    finalCharacter = getLowestCharacterWithNumberOfFights(
      closestsCharactersRank
    );

    // If there is 1 character closest to the rank, return it
  } else if (closestsCharactersRank.length === 1) {
    finalCharacter = closestsCharactersRank[0];
  }
  // Return the final Character.
  return finalCharacter;
}

module.exports = {
  selectFighter: selectFighter,
};
