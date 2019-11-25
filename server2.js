const express = require("express");
const cors = require("cors");
const knex = require("knex");
var path = require("path");
var cookieParser = require("cookie-parser");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "mikkel250",
    password: "",
    database: "smart-brain"
  }
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// list projects
//TESTED WORKING

// cannot send email with a get? May have to just filter by what's in state and send all projects
app.get("/", (req, res) => {
  const { email } = req.params;
  db.select("*")
    .from("projects")
    // .where("projects.admin_email", "=", { email })
    .then(data => res.json(data))
    .catch(err => res.status(400).json("error", err));
});

// create project (form + button )
//TESTED WORKING
app.post("/", (req, res) => {
  const { projectName, email } = req.body;

  console.log(`received: ${projectName}, ${email}`);

  //direct insert
  db("projects")
    .insert({ project_name: projectName, admin_email: email })
    .then(project => {
      res.json(project); // respond back to request
    })
    .catch(err => res.status(400).json("error creating project", err));
});

// need to figure out WHERE, ANDWHERE
app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  db.select("*")
    .from("users")
    .where("email", "=", email)
    .andWhere(("password", "=", password))
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json("unable to get user"));
});

//same as register - allow admin user creation
app.post("/users", (req, res) => {
  //email, password, name, is_admin
  const { email, name, password, is_admin } = req.body;
  try {
    res.status(200).json(`recieved ${email}, ${name}, ${password}`);
  } catch (err) {
    res.status(400).json("error", err);
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  db("users")
    .insert({
      name: name,
      email: email,
      password: password,
      is_admin: false,
      date_joined: new Date()
    })

    .then(data => {
      res.json(data); // respond back to request with user to load in state
    })
    .catch(err => res.status(400).json("error creating project", err));
});

//admin delete user command
app.post("/users/:id/destroy", (req, res) => {
  const id = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then(user => db.delete(user));
  res
    .status(200)
    .json("users delete successful")
    .catch(err => res.status(400).json("error", error));
});

// don't forget to add Express error handling! to final app

app.listen(3001, () => {
  console.log("app is running on port 3001");
});
