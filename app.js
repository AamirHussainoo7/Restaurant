const express = require("express");
const fs = require("fs");
const path = require("path");
const session=require("express-session");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const PORT = 3050;
const Clientres1=require('./mongodb/reservation');
const Clientcon1=require('./mongodb/contact');
const Client1=require('./mongodb/sign');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
  });
  
  app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
  });
  
  app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
  });
  app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, "/about.html"));
  });
  app.get('/menu.html', (req, res) => {
    res.sendFile(path.join(__dirname, "/menu.html"));
  });
  app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, "/login.html"));
  });

  app.post('/login', async (req, res) => {
    const {email, password } = req.body;
  
    try {
      const user = await Client1.findOne({email, password });
      if (user) {
        req.session.userId = user._id;
        res.redirect('/');
      } else {
        res.status(401).send('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/log',(req,res)=>{
    if(req.session.userId){
        res.json({loggedIn: true, userId: req.session.userId});
    }
    else{
        res.json({loggedIn: false});
    }
  })

  app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, "/signup.html"));
  });
  app.post('/signup', async (req, res) => {
    try {
      const client = req.body;
      const newClient = new Client1(client);
      await newClient.save();
      res.redirect('/login.html');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.redirect('/');
      }
    });
  });

  app.get('/reservation.html', (req, res) => {
    res.sendFile(path.join(__dirname, "/reservation.html"));
  });
app.post('/reservation', async (req, res) => {
    try {
      const clientres = req.body;
      const newClient = new Clientres1(clientres);
      await newClient.save();
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  app.get('/contact us.html', (req, res) => {
    res.sendFile(path.join(__dirname, "/contact us.html"));
  });
  
  app.post('/contact', async (req, res) => {
    try {
      const clientcon = req.body;
      const newClient = new Clientcon1(clientcon);
      await newClient.save();
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });



  app.use((req, res) => {
    res.status(404).send("404 Not Found");
  });
  
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });