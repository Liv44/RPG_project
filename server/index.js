const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const PORT = process.env.PORT || 3001;
const bcrypt = require("bcryptjs");
const selectFighter = require("./selectFighter");
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
    "CREATE TABLE IF NOT EXISTS fight(ID integer PRIMARY KEY AUTOINCREMENT NOT NULL,fighter1ID INTEGER,fighter2ID INTEGER,date date NOT NULL,fighter1Won BOOLEAN NOT NULL,FOREIGN KEY(fighter1ID)REFERENCES character(ID)ON DELETE SET NULL,FOREIGN KEY(fighter2ID)REFERENCES character(ID)ON DELETE SET NULL);"
  );
  console.log("Database updated");
});

//Lauching server on port 3001
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Show all characters from one user
app.get("/characters/:userID", (req, res) => {
  const userID = req.params.userID;
  // SQL query to select all characters from 1 user
  db.all("SELECT * FROM character WHERE userID = ?", userID, (err, rows) => {
    if (err) {
      throw err;
    }
    res.send({ error: null, success: true, result: rows });
  });
});

// Show details from one character
app.get("/character/details/:characterID", (req, res) => {
  const characterID = req.params.characterID;
  // SQL query to select details from 1 character
  db.all("SELECT * FROM character WHERE ID = ?", characterID, (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

// Add a new character
app.post("/character/new", (req, res) => {
  const { name, userID } = req.body;

  // Check numbers of character a user have
  db.all("SELECT * FROM character WHERE userID = ?", userID, (err, rows) => {
    if (err) {
      throw err;
    }
    // if the user have already 10 characters, the new character cannot be added
    if (rows.length === 10) {
      res.send({
        error: "Max. of 10 characters reached",
        success: false,
        result: null,
      });
    } else {
      // Adding the new character with its name and its user ID
      db.run(
        "INSERT INTO character (name, userID) VALUES(?,?)",
        [name, userID],
        (err, result) => {
          if (err) {
            throw err;
          }

          res.send({
            error: false,
            success: true,
          });
        }
      );
    }
  });
});

// Edit status of a character (attack, defense etc.)
app.put("/character/edit/:characterID", (req, res) => {
  const characterID = req.params.characterID;
  const { name, health, attack, defense, magik } = req.body;

  //SQL Query to get old stats from the character
  db.all("SELECT * FROM character WHERE ID = ?", characterID, (err, rows) => {
    if (err) {
      throw err;
    }

    const oldHealth = rows[0].health;
    const oldAttack = rows[0].attack;
    const oldDefense = rows[0].defense;
    const oldMagik = rows[0].magik;
    const oldSkillPoints = rows[0].skillPoints;

    // First, verify if the character doesn't have 0 skill points
    // Second, check if there is enough skill points to add new points to stats.
    // If it's all good, update character's stats
    if (oldSkillPoints === 0) {
      res.send({ error: "You have 0 skills points.", success: false });
    } else if (health + attack + defense + magik < oldSkillPoints) {
      res.send({
        error: "You don't have enough skills points.",
        success: false,
      });
    } else {
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
          res.send({
            error: null,
            sucess: true,
          });
        }
      );
    }
  });
});

//Delete a character
app.delete("/character/delete", (req, res) => {
  const { characterID, userID } = req.body;

  // SQL Query to verify if the character exists
  db.all("SELECT * FROM character WHERE ID = ?", characterID, (err, rows) => {
    if (err) {
      throw err;
    }
    // If no character is found, send an error
    if (rows.length === 0) {
      res.send({
        error: "You cannot delete a character which does not exist.",
        success: false,
      });
    }
    // If the character is not from the user, send an error
    else if (rows[0].userID !== userID) {
      res.send({
        error: "You cannot delete a character from an other user",
        success: false,
      });
    } else {
      // SQL Query to delete the character
      db.run(
        "DELETE FROM character WHERE ID = ?",
        characterID,
        (err, result) => {
          if (err) {
            throw err;
          }

          res.send({
            error: null,
            success: result,
          });
        }
      );
    }
  });
});

// Show all fights from one character
app.get("/character/fights/:characterID", (req, res) => {
  const characterID = req.params.characterID;

  // SQL Query with INNER JOIN to get names of fighter 1, fighter 2, and the winner.
  db.all(
    "SELECT f1.name AS 'Fighter 1',f2.name AS 'Fighter 2', fighter1Won AS 'Fighter 1 Won',date as 'Date' FROM fight INNER JOIN character AS f1 ON f1.ID=fight.fighter1ID INNER JOIN character AS f2 ON f2.ID=fight.fighter2ID WHERE f1.ID=? OR f2.ID=? ORDER BY date DESC",
    [characterID, characterID],
    (err, rows) => {
      if (err) {
        throw err;
      }
      res.send({ err: null, success: true, result: rows });
    }
  );
});

// Add a new fight
app.post("/fight/new", (req, res) => {
  const { fighter1ID, fighter2ID, winnerID } = req.body;
  // Check some errors (same fighter, or different winner).
  if (fighter1ID === fighter2ID) {
    res.send({
      error: "Les 2 personnages ne peuvent être les mêmes.",
      success: false,
    });
  } else if (winnerID != fighter1ID && winnerID != fighter2ID) {
    res.send({
      error: "Le gagnant doit être un des personnages joués.",
      success: false,
    });
  } else {
    // Create const with the ID of the loser.
    const loserID = winnerID === fighter1ID ? fighter2ID : fighter1ID;
    const date = new Date().toUTCString();

    //SQL Query to check if the 2 fighters exists in the database
    db.all(
      "SELECT * FROM character WHERE ID = ? OR ID = ?",
      [fighter2ID, fighter1ID],
      (err, rows) => {
        if (err) {
          throw err;
        }
        if (rows.length < 2) {
          res.send({
            error: "Le (ou les) personnage(s) n'existe(nt) pas.",
            success: false,
          });
        } else {
          //SQL Query to add a new fight, with a ternary condition to check if the winner is fighter1 or 2.
          db.run(
            "INSERT INTO fight (fighter1ID, fighter2ID, date, fighter1won) VALUES (?,?,?, ?)",
            [
              fighter1ID,
              fighter2ID,
              date,
              winnerID == fighter1ID ? true : false,
            ],
            (err) => {
              if (err) {
                throw err;
              }

              //SQL Query to get old skills points and rank from the winner
              db.all(
                "SELECT skillPoints, rank, numberFights FROM character WHERE ID = ?",
                winnerID,
                (err, rows) => {
                  if (err) {
                    throw err;
                  }
                  const oldSkillPoints = rows[0].skillPoints;
                  const oldRank = rows[0].rank;
                  const oldNumberFights = rows[0].numberFights;
                  //SQL Query to update skillPoints and Rank for the winner
                  db.run(
                    "UPDATE character SET dateLastFight = ?, statusLastFight = true, rank = ?, skillPoints = ?, numberFights = ? WHERE ID = ?",
                    [
                      date,
                      oldRank + 1,
                      oldSkillPoints + 1,
                      oldNumberFights + 1,
                      winnerID,
                    ]
                  );
                }
              );
              //SQL QUERY to Check loser's rank to lower it
              db.all(
                "SELECT rank, numberFights FROM character WHERE ID = ?",
                loserID,
                (err, rows) => {
                  if (err) {
                    throw err;
                  }
                  const oldRank = rows[0].rank;
                  const oldNumberFights = rows[0].numberFights;
                  // ternary condition to check if the old rank is already 1. If it's 1, rank remains 1.
                  db.run(
                    "UPDATE character SET dateLastFight = ?, statusLastFight = false, rank = ?, numberFights = ? WHERE ID = ?",
                    [
                      date,
                      oldRank == 1 ? oldRank : oldRank - 1,
                      oldNumberFights + 1,
                      loserID,
                    ]
                  );
                }
              );

              // When all Queries are done (add fight, update skills and rank to winner and loser) :
              // Send success response
              res.send({
                error: null,
                success: true,
              });
            }
          );
        }
      }
    );
  }
});

//Select a fighter
app.get("/fight/selectFighter", (req, res) => {
  const { characterID, userID } = req.body;

  //SQL Query to have character rank and check if the character belongs to the user.
  db.all(
    "SELECT rank FROM character WHERE userID = ? AND ID = ?",
    [userID, characterID],
    (err, rows) => {
      if (err) {
        throw err;
      }

      // Check if there is a character for this ID and this user
      if (rows.length === 0) {
        res.send({ err: "No character found for this user.", success: false });
      } else {
        //Get character's player rank
        const characterPlayerRank = rows[0].rank;
        db.all(
          //SQL Query to get all non-userID characters
          "SELECT * FROM character WHERE userID != ?",
          userID,
          (err, rows) => {
            if (err) {
              throw err;
            }
            // Module function to select a fighter with different conditions
            res.send(selectFighter.selectFighter(rows, characterPlayerRank));
          }
        );
      }
    }
  );
});

// User Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // SQL Query to check username
  db.all("SELECT * FROM user WHERE username = ?", username, (err, rows) => {
    if (err) {
      throw err;
    }
    // Check if this user exists
    if (rows.length === 0) {
      res.send({
        err: "L'utilisateur n'a pas été trouvé.",
        success: false,
      });
    } else {
      // Compare password entered and password in database
      bcrypt.compare(password, rows[0].passwordHashed, (err, result) => {
        if (err) {
          throw err;
        }
        //Check the comparison result
        if (result) {
          res.send({ err: null, success: true });
        } else {
          res.send({
            err: "Mot de passe incorrect",
            success: false,
          });
        }
      });
    }
  });
});
