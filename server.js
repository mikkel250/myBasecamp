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

// create project form and list projects
app.get("/", (req, res) => {
  //const { email } = req.params;
  // db.select("*")
  // .from("project")
  // .join("project_admin", "project.id", "=", "project_admin.project_id")
  //   .where("project_admin.email", { email })
  //   .then(data => console.log(data))
  try {
    res.status(200).json("homepage loaded");
  } catch (err) {
    res.status(400).json("error", err);
  }
});

app.post("/", (req, res) => {
  // create project
  // body of post request is projectName: "..."
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  try {
    res.status(200).json(`recieved ${email}, ${password}`);
  } catch (err) {
    res.status(400).json("signin error", err);
  }

  // db.select("email", "hash")
  //   .from("login")
  //   .where("email", "=", req.body.email)
  //   .then(data => {
  //     const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
  //     if (isValid) {
  //       return db
  //         .select("*")
  //         .from("users")
  //         .where("email", "=", req.body.email)
  //         .then(user => {
  //           res.json(user[0]);
  //         })
  //         .catch(err => res.status(400).json("unable to get user"));
  //     } else {
  //       res.status(400).json("wrong credentials");
  //     }
  //   })
});

app.get("/users", (req, res) => {
  // db.select("*")
  //   .from("users")
  //   .then(data => res(data));
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

  try {
    res.status(200).json(`recieved ${email}, ${name}, ${password}`);
  } catch (err) {
    res.status(400).json("error", err);
  }
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

// don't forget to add error handling! to final app

app.listen(3001, () => {
  console.log("app is running on port 3001");
});
