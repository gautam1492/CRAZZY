app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const filePath = path.join(__dirname, "users.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err || !data) {
      return res.status(500).json({ message: "Error reading users file" });
    }

    let users;
    try {
      users = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ message: "Failed to parse user data" });
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      res.json({ message: "Login successful", fullname: user.fullname });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  });
});

const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // where your HTML form is

app.post('/submit', (req, res) => {
  const user = req.body;

  fs.readFile('users.json', 'utf8', (err, data) => {
    let users = [];
    if (!err && data) {
      users = JSON.parse(data);
    }
    users.push(user);

    fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).json({ message: 'Failed to save user' });
      res.json({ message: 'User saved successfully' });
    });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
