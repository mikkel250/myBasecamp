require("dotenv").config();
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

// list projects on landing page
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
    .returning("*")
    .insert({ project_name: projectName, admin_email: email })
    .then(project => {
      res.json(project[0]); // returns created project
    })
    .catch(err => res.status(400).json("error creating project", err));
});

// this checks the database and returns the user if exists
app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  db.raw(
    `select * from users where users.email = '${email}' and users.password = '${password}'`
  ).then(user => {
    res.status(200).json(user);
  });
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

app.get("/users", (req, res) => {
  db.select("*")
    .from("users")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.status(400).json("unable to get users"));
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
  const id = req.body.id;
  console.log(id);
  db("users")
    .where({ id: id })
    .del()
    .then(console.log({ id: id }))
    .then(res.status(200).json("user deleted successfully"))

    .catch(err => res.status(400).json("error", err));
});

// make and remove admin buttons on frontend. send id in params. For now, I have it returning "success" - I'm having trouble getting it to return anything else at the moment
app.put("/users", (req, res) => {
  const { id, is_admin } = req.body;

  db("users")
    .where({ id: id })
    .update({ is_admin: is_admin })
    .then(res.status(200).json("success"))
    .catch(err =>
      res.json(400).json("No such user or some other error occurred", err)
    );
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
