const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/dummy_data', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;

    const newUser = new User({
        email: email,
        password: password
    });

    try {
        await newUser.save();
        console.log('User data saved to MongoDB:', newUser);
        res.send('Login successful!');
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).send('Error saving user data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
