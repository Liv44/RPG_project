export interface CharacterType {
  ID: number;
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
