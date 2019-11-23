
-- to create users table in database:
CREATE TABLE users (
    id          serial NOT NULL PRIMARY KEY,
    email       text UNIQUE NOT NULL,
    name        varchar(100),
    is_admin    BOOLEAN NOT NULL,
    date_joined date
);



--  to create login table in database:
CREATE TABLE login (
    id          serial NOT NULL PRIMARY KEY,
    email       varchar(100) NOT NULL,
    password    varchar(100) NOT NULL
);

-- create a project table (for each project)
CREATE TABLE project (
    id          serial NOT NULL PRIMARY KEY,
    start_date  date,
    end_date    date,
    project_name varchar (128),
    project_description text

);

-- create table for project admin
CREATE TABLE project_admin
(
    id serial NOT NULL PRIMARY KEY,
    project_id  int NOT NULL,
    project_name text NOT NULL,
    email varchar(100) NOT NULL    
);

-- create table for project members
CREATE TABLE project_members (
    id          serial NOT NULL PRIMARY KEY,
    project_id  int NOT NULL,
    project_name text NOT NULL,
    email varchar(100) NOT NULL
);

-- join tables:
SELECT * FROM users JOIN login on users.email = login.email;

-- join all tables relevant to a project
SELECT * FROM project 
JOIN project_admin ON project.id = project_admin.project_id 
JOIN project_members ON project.id = project_members.project_id;

-- join all tables relevant to a user


--  to create test user:
INSERT INTO users (email, name, is_admin, date_joined) VALUES ('test@gmail.com', 'test user', 'true', '2019-11-22');
INSERT INTO users (email, name, is_admin, date_joined) VALUES ('test1@gmail.com', 'test user1', 'false', '2019-11-22');
INSERT INTO users (email, name, is_admin, date_joined) VALUES ('test2@gmail.com', 'test user2', 'true', '2019-11-22');


--  to add test user to login table with test hash:
INSERT INTO login(email, password) VALUES ('test@gmail.com', 'thisIsAFakeHash');
INSERT INTO login(email, password) VALUES ('test1@gmail.com', 'thisIsAFakeHash1');
INSERT INTO login(email, password) VALUES ('test2@gmail.com', 'thisIsAFakeHash2');


-- insert into projects
INSERT INTO project
    (start_date, end_date, project_name, project_description)
VALUES
    ('2019-11-22', '2019-11-30','test proj', 'A basecamp clone');

INSERT INTO project
    (start_date, end_date, project_name, project_description)
VALUES
    ('2019-11-22', '2019-11-30', 'test proj2', 'Another basecamp clone');

-- add admin
INSERT INTO project_admin
    (project_id, project_name, email)
VALUES
    ('1', 'test proj', 'test@gmail.com');

-- add member
INSERT INTO project_members
    (project_id, project_name, member_email)
VALUES
    ('1', 'test proj', 'test1@gmail.com');

-- add member to second project
INSERT INTO project_members
    (project_id, project_name, member_email)
VALUES
    ('2', 'test proj2', 'mikkel250@gmail.com');


-- get all projects for a specific user
select *
from project 
join project_admin on project.id = project_admin.project_id
join project_members on project.id = project_members.project_id
where email = 'mikkel250@gmail.com';

--this also works, but is only returning one project even tho email is in two: one as admin and one as project_member;

select *
from project 
join project_admin on project.id = project_admin.project_id
join project_members on project.id = project_members.project_id
where project_members.email = 'mikkel250@gmail.com' or project_admin.email = 'mikkel250@gmail.com';



-- sql commands & tricks --

-- to copy a db: http://www.postgresqltutorial.com/postgresql-copy-database/

--edit row
 update celebs set twitter_handle = '@taylorswift13' where id = 4;

 -- delete row(s)
 delete from celebs where twitter_handle is null;

--set a default when creating a table
date_of_death TEXT DEFAULT 'Not Applicable'

-- display duplicate value only once in results
select distinct year from movies;

-- select based on criteria, which can be =, !=, >, <, >=, <=
select * from movies where imdb_rating < 5;

-- compare similar values, use an underscore to represent a wildcard:
SELECT *
FROM movies
WHERE name LIKE 'Se_en';

-- A% matches all movies with names that begin with letter ‘A’
-- %a matches all movies that end with ‘a’
-- We can also use % both before and after a pattern:

SELECT *
FROM movies
WHERE name LIKE '%man%';

select * from movies where name like 'The %';

-- It is not possible to test for NULL values with comparison operators, such as = and !=.

-- Instead, we will have to use these operators:

-- IS NULL
-- IS NOT NULL

select name from movies where imdb_rating is null;

-- SELECT is the clause we use every time we want to query information from a database.
-- AS renames a column or table.
-- DISTINCT return unique values.
-- WHERE is a popular command that lets you filter the results of the query based on conditions that you specify.
-- LIKE and BETWEEN are special operators.
-- AND and OR combines multiple conditions.
-- ORDER BY sorts the result.
-- LIMIT specifies the maximum number of rows that the query will return.
-- CASE creates different outputs.

-- find within range:
SELECT *
FROM movies
WHERE year BETWEEN 1990 AND 1999;

SELECT *
FROM movies
WHERE name BETWEEN 'A' AND 'J';

-- use the AND operator to make queries more specific
SELECT *
FROM movies
WHERE year BETWEEN 1990 AND 1999
   AND genre = 'romance';

-- OR operator displays a row if any condition is true.

-- use ORDER BY year DESC or ASC to order results of queries.
-- use LIMIT to only return specified number of results e.g. LIMIT 10
--combining the two above:
select * from movies order by imdb_rating DESC limit 3;

-- A CASE statement allows us to create different outputs (usually in the SELECT statement). It is SQL’s way of handling if-then logic. END AS lets you rename the column, otherwise, just use END
SELECT name,
 CASE
  WHEN imdb_rating > 8 THEN 'Fantastic'
  WHEN imdb_rating > 6 THEN 'Poorly Received'
  ELSE 'Avoid at All Costs'
 END AS 'Review'
FROM movies;


-- joins

--join with where
SELECT *
from orders join subscriptions on orders.subscription_id = subscriptions.subscription_id
where description = 'Fashion Magazine';


-- create superuser
createuser -s mikkel250
