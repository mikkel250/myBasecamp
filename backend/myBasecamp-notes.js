// --------------- from the project description email -------------------

// 1. User Registration
//     - User #new
//     - User #create
//     - User #destroy
// In summary, you should be able to create a new user, delete a user, and as a new user, create an account yourself.

// 2. Session
//     - User #sign_in
//     - User #sign_out
// Users should be able to log in and log out.

// 3. Role Permission
//     - User setAdmin
//     - User removeAdmin
// This means you will have two types of permissions, someone who is a user, and someone who is a user and an admin. We want the ability to also remove the admin permission from a user.

// 4. Project
//     - Project #new
//     - Project #edit
//     - Project #destroy
// Similar to the real Basecamp, users should be able to create, edit, and destroy a project.

// -----------------end description --------------------------------
// here is a great visualization for a DB layout: https://my.vertabelo.com/model/j7snGaXT5qJ0Uyz3ZKIbMPrP9qiCyAya

// Routes:
// Frontend -->  Backend --> permission restrictions if any

// Register--> /users/new
// create --> /users/create --> admin
// delete --> /users/destroy --> admin

// sign in --> /users/signIn
// sign out --> /users/signout

// set admin --> /users/:id/setAdmin --> admin
// remove admin --> users/:id/removeAdmin --> admin

// new project --> /projects/new
// edit project --> /projects/:id/edit --> project_admin, project_member
// delete project --> projects/:id/destroy --> project_admin

//user configuration
const user = {
  id: "",
  name: "",
  isLoggedIn: false,
  isAdmin: false,
  created: new Date(),
  isProjectOwner: {
    project1: true
  },
  isProjectMember: {
    project2: true
  }
};

// project object from database
const project = {
  id: "",
  members: {
    memberName: memberId
  }
};

// notes:
if (isProjectOwner || isProjectMember) {
  //can be used for project access
}

// can fetch the project object from the backend and then iterate over project[members] to display a list who's on the project in the frontend

// to get all the users 
app.get("/", (req, res) => {
  db.select('*').from("users").then(data => console.log(data));
});

app.post('/', (req, res) => {
  // create project
})

// returns data in this shape
[ { id: 1,
    email: 'mikkel250@gmail.com',
    password: 'testpwd',
    name: 'Mikkel Ridley',
    is_admin: true,
    date_joined: 2019-11-22T08:00:00.000Z },
  { id: 2,
    email: 'kseninavoi@gmail.com',
    password: 'admin',
    name: 'Kseniia Navoi',
    is_admin: true,
    date_joined: 2019 - 11 - 22T08: 00: 00.000Z
  }]
    
// so we would want to use data to get access to the items inside the array (which are objects) 
