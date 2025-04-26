const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Hilfsfunktion: Nutzerdatei laden
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
// Hilfsfunktion: Nutzerdatei speichern
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Registrierung
app.post('/api/register', async (req, res) => {
  const { name, pass, img } = req.body;
  if (!name || !pass) return res.status(400).json({ error: 'Name und Passwort erforderlich.' });
  let users = loadUsers();
  if (users.find(u => u.name === name)) return res.status(409).json({ error: 'Nutzername existiert bereits.' });
  const hash = await bcrypt.hash(pass, 10);
  users.push({ name, pass: hash, img: img || '' });
  saveUsers(users);
  res.json({ success: true });
});

// Login
app.post('/api/login', async (req, res) => {
  const { name, pass } = req.body;
  let users = loadUsers();
  const user = users.find(u => u.name === name);
  if (!user) return res.status(404).json({ error: 'Nutzer nicht gefunden.' });
  const ok = await bcrypt.compare(pass, user.pass);
  if (!ok) return res.status(401).json({ error: 'Falsches Passwort.' });
  res.json({ success: true, name: user.name, img: user.img });
});

// Starte Server
app.listen(PORT, () => {
  console.log('Server läuft auf http://localhost:' + PORT);
}); 