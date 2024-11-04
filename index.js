const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Dummy user data
const USERS = {
  'user@example.com': 'password123'
};

// Render login form
app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="POST">
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  `);
});

// Handle login logic
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (USERS[email] && USERS[email] === password) {
    res.send('Login successful!');
  } else {
    res.send('Invalid email or password');
  }
});

// Handle sign up
app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  if (!USERS[email]) {
    USERS[email] = password;
    res.send('Sign up successful!');
  } else {
    res.send('Email already exists');
  }
});

/*************  ✨ Codeium Command ⭐  *************/
// Handle update user profile
app.put('/profile', (req, res) => {
  const { email, password, name, avatar } = req.body;
  if (USERS[email] && USERS[email] === password) {
    USERS[email] = password;
    USERS[email + '_avatar'] = avatar;
    res.send('Profile updated!');
  } else {
    res.send('Invalid email or password');
  }
});

// In-memory storage for articles
const ARTICLES = [];

// Handle create article
app.post('/articles', (req, res) => {
  const { title, body } = req.body;
  if (title && body) {
    ARTICLES.push({ title, body });
    res.send('Article created successfully!');
  } else {
    res.send('Title and body are required');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
