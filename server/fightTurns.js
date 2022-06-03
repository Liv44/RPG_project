function oneTurn(fighter1, fighter2) {
  const attackValue = Math.floor(Math.random() * fighter1.attack) + 1;
  const difference = attackValue - fighter2.defense;

  let finalAttack = 0;
  let returning = { message: "", winner: "", healthPointsRemoved: 0 };
  if (difference > 0) {
    if (difference === fighter1.magik) {
      finalAttack = difference * 2;
      lowerHealthPoints(fighter2, difference * 2);
    } else {
      finalAttack = difference;
    }
    if (lowerHealthPoints(fighter2, finalAttack) == 0) {
      returning.message = `${fighter1.name} lance une attaque de ${attackValue} sur ${fighter2.name}.Cela inflige un dégat de ${finalAttack}.\n  ${fighter2.name} est mort. ${fighter1.name} gagne !`;
      returning.winner = fighter1.name;
      returning.healthPointsRemoved = finalAttack;
    } else {
      returning.message = `${fighter1.name} lance une attaque de ${attackValue} sur ${fighter2.name}.Cela inflige un dégat de ${finalAttack}. ${fighter2.name} perd ${finalAttack} points de vie`;
      returning.healthPointsRemoved = finalAttack;
    }
  } else {
    returning.message = `${fighter1.name} lance une attaque de ${attackValue} sur ${fighter2.name}. L'attaque échoue.`;
    returning.healthPointsRemoved = 0;
  }
  return returning;
}

function lowerHealthPoints(character, points) {
  character.healthPoints -= points;
  if (character.healthPoints <= 0) {
    return 1;
  }
  return 0;
}

module.exports = {
  fightTurns: oneTurn,
};
