const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      password: "cookies",
      email: "john@gmail.com",
      entries: 0,
      joined: new Date()
    },
    {
      id: "124",
      name: "Sally",
      password: "bananas",
      email: "sally@gmail.com",
      entries: 0,
      joined: new Date()
    },
    {
      id: "125",
      name: "Steven",
      password: "password",
      email: "steven@rothenburger.dev",
      entries: 0,
      joined: new Date()
    },
    {
      id: "126",
      name: "Steven",
      password: "a",
      email: "123@123.com",
      entries: 0,
      joined: new Date()
    }
  ]
};

app.get("/", (req, res) => {
  res.send(database.users);
});


// What to do if the server recieves a POST request from the signin
// page.
app.post("/signin", (req, res) => {


  // FIXME: Hashing API

  // Load hash from your password DB.
  // bcrypt.compare("bacon", "hash", function(err, res) {
  //   // res == true
  // });
  // bcrypt.compare("veggies", "hash", function(err, res) {
  //   // res = false
  // });



// Authenticate username
console.log("request",req.body)

  for (let person of database.users){
    console.log(person)
    if (
      req.body.email === person.email &&
      req.body.password === person.password
    ) {
      res.json(person);
    } else {
      // FIXME: This status causes an error
      // res.status(400).json("error logging in");
    }
  }
    res.json("signin");

  
  });

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: "125",
    name: name,
    password:password,
    email: email,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("not found");
  }
});

app.post("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("not found");
  }
});

// bcrypt.hash("bacon", null, null, function(err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//   // res = false
// });

app.listen(3001, () => {
  console.log("app is running on port 3000");
});
