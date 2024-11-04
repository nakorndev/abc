const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Dummy user data
const USERS = {
  'user@example.com': 'password123'
};

// Handle admin login
app.post('/admin', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin' && password === 'admin') {
    res.send('Login successful!');
  } else {
    res.send('Invalid email or password');
  }
});

// Handle admin manage user
app.get('/admin/manage-user', (req, res) => {
  res.send(`
    <h1>Manage User</h1>
    <form action="/admin/manage-user" method="POST">
      <input type="email" name="email" placeholder="Email" required />
      <button type="submit">Add User</button>
    </form>
    <ul>
    ${Object.keys(USERS).map(email => `<li>${email}</li>`).join('')}
    </ul>
  `);
});

app.post('/admin/manage-user', (req, res) => {
  const { email } = req.body;
  if (email) {
    USERS[email] = 'password123';
    res.redirect('/admin/manage-user');
  } else {
    res.send('Please fill out the form');
  }
});

// Handle admin manage user permission
app.get('/admin/manage-user/:email/permission', (req, res) => {
  const { email } = req.params;
  const permission = USERS[email + '_permission'] === 'true';
  res.send(`
    <h1>Manage User Permission</h1>
    <form action="/admin/manage-user/${email}/permission" method="POST">
      <label>
        <input type="checkbox" name="permission" ${permission ? 'checked' : ''} />
        Allow user to create article
      </label>
      <button type="submit">Save</button>
    </form>
  `);
});

app.post('/admin/manage-user/:email/permission', (req, res) => {
  const { email } = req.params;
  const { permission } = req.body;
  USERS[email + '_permission'] = permission;
  res.redirect('/admin/manage-user');
});

// Handle admin manage article
app.post('/admin/articles/manage', (req, res) => {
  const { email, password, action, articleIndex, articleData } = req.body;
  if (email === 'admin' && password === 'admin') {
    if (action === 'delete' && ARTICLES[articleIndex]) {
      ARTICLES.splice(articleIndex, 1);
      res.send('Article deleted successfully!');
    } else if (action === 'update' && ARTICLES[articleIndex]) {
      ARTICLES[articleIndex] = articleData;
      res.send('Article updated successfully!');
    } else {
      res.send('Invalid action or article index');
    }
  } else {
    res.send('Invalid email or password');
  }
});

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
