const crypto = require("crypto");

function generateSessionSecret(length) {
  return crypto.randomBytes(length).toString("hex");
}

const sessionSecret = generateSessionSecret(32); // Génère une clé secrète de 64 caractères hexadécimaux
console.log(sessionSecret);
