app.get("/"); // list projects
app.post("/"); // create project
app.post("/signin");
app.post("/register");
app.get("/users"); // this will list all users in the app and have a creation form for admins
app.post("/users"); // this is the same as register and add "is admin" checkbox
app.put("/users"); // remove admin button on frontend
app.post("/users/:id/destroy"); // delete user admin only

// ------ next, project endpoints -----------


//the users will look like this in the database, so for the frontend
const user = {
  // id: "",
  email: "",
  name: "",
  password: ""
  // is_admin: false,
  // date_joined: new Date(),
  // isLoggedIn: false
};
