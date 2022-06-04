# Projet RPG dans le cadre de ma candidature dans l'entreprise theTribe

# LANCER LE PROJET

- Aller dans le dossier server :
  - Lancer la commande `npm install`
  - Lancer la commande `npm start`
- Aller dans le dossier app :
  - Lancer la commande `npm install`
  - Lancer la commande `npm start`
    Sur un navigateur, aller sur l'URL [localhost:3000](http://localhost:3000)

### Fonctionnalités mises en place :

- Affichage des personnages d'un utilisateur
- Distribution des points de compétences d'un personnage
- Affichage des derniers combats du personnage
- Ajout d'un personnage
- Lancement d'un combat :
  - Sélection d'un adversaire
  - Redirection vers la page fight
  - Algorithmie pour les tours de jeu

### Fonctionnalités à mettre en place :

- Connexion / Inscription (le endpoint pour le login est créé.)
- Suppression d'un compte
- Vérification si le personnage choisi par l'utilisateur est disponible pour le combat (vérification faite pour le choix de l'adversaire)

### Points d'amélioration :

- Ajouter des tests sur tout le code effectué (compétence non apprise).
- Refactoriser le code du BACK (fichier index.js trop long, manque de compétences pour savoir comment réduire ou scinder en plusieurs fichiers.)
- Ajout de commentaires + spécifiques.
- Refactoriser certains composants en Front car parfois certains sont très longs
- La distribution des skillPoints ne prévoit pas pour l’instant le calcul des différentes stats du personnage. 1 skill point = 1 point de vie ou 1 point d’attaque.

### Frameworks et librairies utilisées :

_FRONT END :_

- J'ai utilisé React car c'est un framework que j'affectionne beaucoup.
- J’ai décidé d’utiliser la librairie Chakra UI car je souhaitais gagner du temps pour la réalisation du front end. De plus, c’est une librairie que j’affectionne et que je souhaite mieux maîtriser.

_BACK END :_

- J'ai utilisé NodeJS car j'ai pu l'utiliser sur mon dernier projet et je souhaitais continuer à monter en compétences dessus.
- J'ai utilisé bcrypt pour hasher les mots de passe.
- J'ai aussi utilisé express-session pour gérer les sessions.
