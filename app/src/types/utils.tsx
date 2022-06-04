export interface CharacterType {
  ID: number;
  userID: number;
  name: string;
  rank: number;
  skillPoints: number;
  health: number;
  attack: number;
  defense: number;
  magik: number;
  dateLastFight: Date;
  statusLastFight: boolean;
  numberFights: number;
}

export interface FightType {
  fighter1: string;
  fighter2: string;
  fighter1Won: boolean;
  Date: Date;
}
