const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const PORT = process.env.PORT || 3001;

const app = express();

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});
