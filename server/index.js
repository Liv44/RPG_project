const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

const dbname = "RPG.db";

//Ouvertue de la base de données
let db = new sqlite3.Database(dbname, (err) => {
  if (err) throw err;
  console.log("Database connected to " + dbname);
});
db.serialize(() => {
  db.run(
    "CREATE TABLE  IF NOT EXISTS user (ID integer PRIMARY KEY AUTOINCREMENT NOT NULL , username text NOT NULL, passwordHashed text NOT NULL);"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS character(ID integer PRIMARY KEY AUTOINCREMENT NOT NULL,name text NOT NULL,userID integer NOT NULL,rank integer DEFAULT 1,skillPoints integer DEFAULT 12,health integer DEFAULT 10,attack integer DEFAULT 0,defense INTEGER DEFAULT 0,magik INTEGER DEFAULT 0,dateLastFight DATE,statusLastFight BOOLEAN DEFAULT TRUE,FOREIGN KEY(userID)REFERENCES user(ID));"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS fight (ID integer PRIMARY KEY AUTOINCREMENT NOT NULL,fighter1ID INTEGER NOT NULL,fighter2ID INTEGER NOT NULL,winnerID BOOLEAN NOT NULL,FOREIGN KEY (fighter1ID) REFERENCES character(ID),FOREIGN KEY (fighter2ID) REFERENCES character(ID),FOREIGN KEY (winnerID) REFERENCES character(ID));"
  );
  console.log("Database updated");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/characters/:userID", (req, res) => {
  const userID = req.params.userID;
  db.all("SELECT * FROM character WHERE userID = ?", userID, (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

app.get("/onecharacter/:characterID", (req, res) => {
  const characterID = req.params.characterID;
  db.all("SELECT * FROM character WHERE ID = ?", characterID, (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

app.put("/updateCharacter/:characterID", (req, res) => {
  const characterID = req.params.characterID;
  const { name, health, attack, defense, magik } = req.body;
  db.all("SELECT * FROM character WHERE ID = ?", characterID, (err, rows) => {
    if (err) {
      throw err;
    }

    const oldHealth = rows[0].health;
    const oldAttack = rows[0].attack;
    const oldDefense = rows[0].defense;
    const oldMagik = rows[0].magik;
    const oldSkillPoints = rows[0].skillPoints;
    if (
      oldSkillPoints > 0 &&
      health + attack + defense + magik <= oldSkillPoints
    ) {
      const newHealth = oldHealth + health;
      const newAttack = oldAttack + attack;
      const newDefense = oldDefense + defense;
      const newMagik = oldMagik + magik;
      const newSkillPoints = oldSkillPoints - health - attack - defense - magik;
      db.run(
        "UPDATE character SET name = ?, health = ?, attack = ?, defense = ?, magik = ?, skillPoints = ? WHERE ID = ?",
        name,
        newHealth,
        newAttack,
        newDefense,
        newMagik,
        newSkillPoints,
        characterID,
        (err) => {
          if (err) {
            throw err;
          }
          res.send("Character updated");
        }
      );
    }
  });
});
