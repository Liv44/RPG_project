const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const PORT = process.env.PORT || 3001;
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

const dbname = "RPG.db";

//Ouvertue de la base de données
let db = new sqlite3.Database(dbname, (err) => {
  if (err) throw err;
  console.log("Database connected to " + dbname);
});
db.serialize(() => {
  // Creation of the database, with tables if not existing
  db.run(
    "CREATE TABLE  IF NOT EXISTS user (ID integer PRIMARY KEY AUTOINCREMENT NOT NULL , username text NOT NULL, passwordHashed text NOT NULL);"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS character(ID integer PRIMARY KEY AUTOINCREMENT NOT NULL,name text NOT NULL,userID integer NOT NULL,rank integer DEFAULT 1,skillPoints integer DEFAULT 12,health integer DEFAULT 10,attack integer DEFAULT 0,defense INTEGER DEFAULT 0,magik INTEGER DEFAULT 0,dateLastFight DATE,statusLastFight BOOLEAN DEFAULT TRUE,FOREIGN KEY(userID)REFERENCES user(ID));"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS fight(ID integer PRIMARY KEY AUTOINCREMENT NOT NULL,winnerID BOOLEAN NOT NULL,loserID INTEGER NOT NULL,date date NOT NULL,FOREIGN KEY(winnerID)REFERENCES character(ID),FOREIGN KEY(loserID)REFERENCES character(ID));"
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

app.get("/oneCharacter/:characterID", (req, res) => {
  const characterID = req.params.characterID;
  db.all("SELECT * FROM character WHERE ID = ?", characterID, (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

// Add a new character
app.post("/newCharacter", (req, res) => {
  const { name, userID } = req.body;

  // Check numbers of character a user have
  db.all("SELECT * FROM character WHERE userID = ?", userID, (err, rows) => {
    if (err) {
      throw err;
    }
    // if the user have already 10 characters, the new character cannot be added
    if (rows.length === 10) {
      res.send("Not possible to add a new character.");
    } else {
      // Adding the new character with its name and its user ID
      db.run(
        "INSERT INTO character (name, userID) VALUES(?,?)",
        [name, userID],
        (err, result) => {
          if (err) {
            throw err;
          }

          res.send(result);
        }
      );
    }
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

app.post("/newFight", (req, res) => {
  const { loserID, winnerID } = req.body;
  const date = new Date();
  db.run(
    "INSERT INTO fight (winnerID, loserID, date) VALUES (?,?,?)",
    [winnerID, loserID, date],
    (err) => {
      if (err) {
        throw err;
      }

      //Add date and status fight to winner
      db.all(
        "SELECT skillPoints FROM character WHERE ID = ?",
        winnerID,
        (err, rows) => {
          if (err) {
            throw err;
          }
          const oldSkillPoints = rows[0].skillPoints;
          db.run(
            "UPDATE character SET dateLastFight = ?, statusLastFight = true, skillPoints = ? WHERE ID = ?",
            [date, oldSkillPoints + 1, winnerID]
          );
        }
      );
      db.run(
        "UPDATE character SET dateLastFight = ?, statusLastFight = false WHERE ID = ?",
        [date, loserID]
      );
      res.send("Fight added");
    }
  );
});

// User Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.all("SELECT * FROM user WHERE username = ?", username, (err, rows) => {
    if (err) {
      throw err;
    }
    // Check if this user exists
    if (rows.length === 0) {
      res.send("User not found");
    } else {
      // Compare password entered and password in database
      bcrypt.compare(password, rows[0].passwordHashed, (err, result) => {
        if (err) {
          throw err;
        }
        //Check the comparison result
        if (result) {
          res.send("User Connected");
        } else {
          res.send("Wrong password");
        }
      });
    }
  });
});
