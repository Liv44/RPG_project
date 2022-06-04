function oneTurn(Attacking, Passive, healthPassive) {
  const attackValue = Math.floor(Math.random() * Attacking.attack) + 1;
  //Check difference between attack value and defense value
  const difference = attackValue - Passive.defense;

  let finalAttack = 0;

  // create variable to stock infos
  let returning = {
    message: "",
    winner: "",
    healthPointsRemoved: 0,
    attackPoints: attackValue,
  };

  if (difference > 0) {
    // if difference is greater than 0, then the attack is successful
    if (difference === Attacking.magik) {
      finalAttack = difference * 2;
      lowerHealthPoints(Passive, difference * 2);
    } else {
      finalAttack = difference;
    }

    if (lowerHealthPoints(finalAttack, healthPassive) === 1) {
      // The Passive has been killed
      returning.message = `${Attacking.name} lance une attaque de ${attackValue} sur ${Passive.name}. Cela inflige un dégat de ${finalAttack}.  ${Passive.name} est mort.`;
      returning.winner = Attacking.name;
      returning.healthPointsRemoved = healthPassive;
    } else {
      // The Passive has damages
      returning.message = `${Attacking.name} lance une attaque de ${attackValue} sur ${Passive.name}. Cela inflige un dégat de ${finalAttack}. ${Passive.name} perd ${finalAttack} points de vie`;
      returning.healthPointsRemoved = finalAttack;
    }
  } else {
    // The Passive has no damages
    returning.message = `${Attacking.name} lance une attaque de ${attackValue} sur ${Passive.name}. L'attaque échoue.`;
    returning.healthPointsRemoved = 0;
  }
  return returning;
}

function lowerHealthPoints(points, healthPassive) {
  const newHealthPassive = healthPassive - points;

  if (newHealthPassive <= 0) {
    return 1;
  }
  return 0;
}

module.exports = {
  fightTurns: oneTurn,
};
