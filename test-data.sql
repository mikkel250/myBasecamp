
CREATE TABLE users
(
  id serial NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password varchar(128) NOT NULL,
  name varchar(100),
  is_admin BOOLEAN NOT NULL,
  date_joined date
);

CREATE TABLE projects
(
  id serial NOT NULL PRIMARY KEY,
  project_name varchar (128),
  admin_email varchar(100) NOT NULL
);

-- add this to fancier version
-- CREATE TABLE project_admin
-- (
--   id serial NOT NULL PRIMARY KEY,
--   project_id int NOT NULL,
--   project_name text NOT NULL,
--   email varchar(100) NOT NULL
-- );

-- -- add this to fancier version
-- CREATE TABLE project_members
-- (
--   id serial NOT NULL PRIMARY KEY,
--   project_id int NOT NULL,
--   project_name text NOT NULL,
--   email varchar(100) NOT NULL
-- );

INSERT INTO users
  (email, password, name, is_admin, date_joined)
VALUES
  ('mikkel250@gmail.com', 'testpwd', 'Mikkel Ridley', 'true', '2019-11-22');

INSERT INTO users
  (email, password, name, is_admin, date_joined)
VALUES
  ('kseninavoi@gmail.com', 'admin', 'Kseniia Navoi', 'true', '2019-11-22');


INSERT INTO project
  (start_date, end_date, project_name, project_description)
VALUES
  ('2019-11-22', '2019-11-30', 'test proj', 'A basecamp clone');


INSERT INTO project_admin
  (project_id, project_name, email)
VALUES
  ('1', 'test proj', 'mikkel250@gmail.com');


INSERT INTO project_members
  (project_id, project_name, member_email)
VALUES
  ('1', 'test proj', 'kseninavoi@gmail.com');







-- join all tables relevant to a project
SELECT *
FROM project
  JOIN project_admin ON project.id = project_admin.project_id
  JOIN project_members ON project.id = project_members.project_id;