const express = require("express");
const cors = require("cors");
const knex = require("knex");
var path = require("path");
var cookieParser = require("cookie-parser");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// list projects on landing pageherok
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
  const { projectName, projectDescription, email } = req.body;

  db("projects")
    .returning("*")
    .insert({
      project_name: projectName,
      description: projectDescription,
      admin_email: email
    })
    .then(project => {
      res.json(project[0]); // returns created project
    })
    .catch(err => res.status(400).json("error creating project", err));
});

// delete project
app.delete("/", (req, res) => {
  const id = req.body.id;
  console.log(id);
  db("projects")
    .where({ id: id })
    .del()
    .then(console.log({ id: id }))
    .then(res.status(200).json("project deleted successfully"))

    .catch(err => res.status(400).json("error", err));
});

//edit project
app.put("/", (req, res) => {
  const { id, projectName, projectDescription } = req.body;

  db("projects")
    .returning("*")
    .where({ id: id })
    .update({ project_name: projectName, description: projectDescription })
    .then(project => {
      res.status(200).json(project);
    })
    .catch(err => res.status(400).json("error", err));
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  db.raw(
    `select * from users where users.email = '${email}' and users.password = '${password}'`
  );
  db.select("*")
    .from("users")
    .where("email", email)
    .andWhere("password", password)
    .then(user => {
      res.status(200).json(user[0]);
    })
    .catch(err => res.status(400).json("error!!", err));
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
      res.json(user[0]);
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
      res.json(user[0]);
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
    .then(function() {
      db.select("*")
        .from("users")
        .then(users => {
          res.json(users);
        });
    })

    .catch(err => res.status(400).json("error", err));
});

// make and remove admin buttons on frontend. send id in params.
app.put("/users", (req, res) => {
  const { id, is_admin } = req.body;

  db("users")
    .where({ id: id })
    .update({ is_admin: is_admin })
    .then(function() {
      db.select("*")
        .from("users")
        .then(users => {
          res.json(users);
        });
    })
    .catch(err =>
      res.json(400).json("No such user or some other error occurred", err)
    );
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
