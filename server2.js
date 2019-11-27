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
app.get("/", (req, res) => {
  const { email } = req.query;

  db.where({ admin_email: email })
    .select("*")
    .from("projects")

    .then(data => res.json(data[0]))
    .catch(err => res.status(400).json("error", err));
});

// create project (form + button )

app.post("/", (req, res) => {
  const { projectName, email } = req.body;

  console.log(`received: ${projectName}, ${email}`);

  //direct insert
  db("projects")
    .returning("*") //THIS WILL RETURN ONLY THE INSERTED OBJECT, not the whole table
    .insert({ project_name: projectName, admin_email: email })
    .then(project => {
      res.json(project[0]); // respond back to request
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

    .then(user => {
      res.json(user[0]); // respond back to request with user to load in state
    })
    .catch(err => res.status(400).json("error creating project", err));
});

//admin create user
app.post("/users", (req, res) => {
  const { email, name, password, is_admin } = req.body;

  db("users")
    .insert({
      name: name,
      email: email,
      password: password,
      is_admin: is_admin,
      date_joined: new Date()
    })
    .returning("*")
    .then(user => {
      res.json(user[0]); // respond back to request with user to load in state
    })
    .catch(err => res.status(400).json("error creating user", err));
});

//admin delete user command
app.delete("/users", (req, res) => {
  const id = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then(user => db.delete(user));
  res
    .status(200)
    .json("user deleted successfully")
    .catch(err => res.status(400).json("error", error));
});

// make and remove admin buttons on frontend. send id in params. For now, all I have it returning is a "user deleted successfully" success message via JSON
app.put("/users/:id/", (req, res) => {
  const { id, is_admin } = req.params;
  console.log(id, is_admin);

  db("users")
    .where(id)
    .update({ is_admin: is_admin })
    .then(user => res.json(user));
});

// don't forget to add Express error handling! to final app

app.listen(3001, () => {
  console.log("app is running on port 3001");
});
