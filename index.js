const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

// Define a simple route
app.get('/', (req, res) => {
    const data = { title: 'Home Page', message: 'Welcome to EJS with Express!' };
    res.render('index', data);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});