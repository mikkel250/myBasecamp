const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

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
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const { email } = req.params;
  // db.select("*")
  //   .from("project")
  //   .join("project_admin", "project.id", "=", "project_admin.project_id")
  //   .where("project_admin.email", { email })
  //   .then(data => console.log(data))
  //   .catch(err => res.status(400).json("error", err));
});

app.post("/", (req, res) => {
  // create project
  // body of post request is projectName: "..."
});

app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch(err => res.status(400).json("wrong credentials"));
});

app.get("/users", (req, res) => {
  db.select("*")
    .from("projects")
    .then(data => res(data));
});

app.post("/users", (req, res) => {
  //email, password, name, is_admin
  const { email, name, password } = req.body;
  res
    .status(200)
    .json("users post successful")
    .catch(err => res.status(400).json("error", error));
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  res
    .status(200)
    .json("register post successful")
    .catch(err => res.status(400).json("error", error));
});

//admin delete user command
app.post("/users/:id/destroy", (req, res) => {
  const id = req.params;
  // db.select("*")
  //   .from("users")
  //   .where({ id })
  //   .then(user => db.delete(user));
  res
    .status(200)
    .json("users delete successful")
    .catch(err => res.status(400).json("error", error));
});

// leave for last -- not really necessary
// app.get("/profile/:id", (req, res) => {
//   const { id } = req.params;
//   db.select("*")
//     .from("users")
//     .where({ id })
//     .then(user => {
//       if (user.length) {
//         res.json(user[0]);
//       } else {
//         res.status(400).json("Not found");
//       }
//     })
//     .catch(err => res.status(400).json("error getting user"));
// });

// get a list of the users projects
app.get("/projects", (req, res) => {
  const { email } = req.params;
  db.select("*")
    .from("project")
    .join("project_admin", "project.id", "=", "project_admin.project_id")
    .where("project_admin.email", { email })
    .then(data => console.log(data))
    .catch(err => res.status(400).json("error", err));
});

app.listen(3001, () => {
  console.log("app is running on port 3001");
});
