// Import necessary packages
require("console.table");
const inquirer = require("inquirer");
const mysql = require('mysql2/promise');
// directory packages
const fs = require('fs').promises;
const path = require('path');

// global database connection variable
var connection;

// Create a connection to the database server without specifying a database
const serverConnection = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  multipleStatements: true 
});

// Helper function to help execute SQL commands
async function executeSqlFile(filename, conn = serverConnection) {
    const sql = await fs.readFile(path.join(__dirname, './sql/', filename), 'utf-8');
    const [results] = await conn.query(sql);
    return results;
}

// Helper function to help initialize the database
async function initializeDatabase() {
    try {
        // Use the server connection to set up the schema
        await executeSqlFile('schema.sql', serverConnection);
        console.log('Database schema successfully set up.');
        
        // Now that the database exists, create a connection to it
        connection = mysql.createPool({
          host: "localhost",
          port: 3306,
          user: "root",
          password: "password",
          database: "employee_db",
          multipleStatements: true 
        });

        // Use the new connection to seed the database
        await executeSqlFile('seed.sql');
        console.log('Database successfully seeded.');

        // Start user prompts 
        userPrompts();

    } catch (error) {
        console.error('Error setting up or seeding database:', error);
    }
}

// The main function that prompts the user for an action to perform
function userPrompts() {
  // Use inquirer to get user input
  inquirer.prompt({
    message: "Employee Tracker menu:)",
    type: "list",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee role",
      "QUIT"
    ],
    name: "choice"
  }).then(answers => {
    // console.log(answers.choice);
    // Depending on the user's choice, call the corresponding function
    switch (answers.choice) {
      case "view all employees":
        return view_all_employees();
      case "view all roles":
        return view_all_roles();
      case "view all departments":
        return view_all_departments();
      case "add an employee":
        return add_an_employee();
      case "add a department":
        return add_a_department();
      case "add a role":
        return add_a_role();
      case "update an employee role":
        return update_an_employee_role();
        // If the user chooses to quit, end the connection
      case "QUIT":
      default:
        connection.end().then(() => process.exit());
        return;

    }
    // Log any error that occurs
  }).catch(console.error);
}

// Function to view all employees
function view_all_employees() {
  // Query the database for all employees
  connection.query("SELECT * FROM employee").then(([rows]) => {
    // Display the employees in a well formatted table
    console.table(rows);
    // Show the prompts again
    userPrompts();
    // Log any error that occurs
  }).catch(console.error);
}

// Function to view all departments
function view_all_departments() {
  // Query the database for all departments
  connection.query("SELECT * FROM department").then(([rows]) => {
    // Display the departments in a well formatted table
    console.table(rows);
    // Show the prompts again
    userPrompts();
    // Log any error that occurs
  }).catch(console.error);
}

// Function to view all roles
function view_all_roles() {
  // Query the database for all roles
  connection.query("SELECT * FROM role").then(([rows]) => {
    // Display the roles in a well formatted table
    console.table(rows);
    // Show the prompts again
    userPrompts();
    // Log any error that occurs
  }).catch(console.error);
}

// Function to add a department
function add_an_employee() {
  // Use inquirer to get user input
  inquirer.prompt([{
      type: "input",
      name: "first_name",
      message: "What is the employees first name?",
      validate: input => input !== '' || "Please enter a first name."
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employees last name?",
      validate: input => input !== '' || "Please enter a last name."
    },
    {
      type: "number",
      name: "role_id",
      message: "What is the employees role ID",
      validate: input => !isNaN(input) || "Please enter a number."
    },
    {
      type: "number",
      name: "manager_id",
      message: "What is the employees manager's ID?",
      validate: input => !isNaN(input) || "Please enter a number."
    }
  ]).then(response => {
    // Query the database to add an employee
    return connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [response.first_name, response.last_name, response.role_id, response.manager_id]);
  }).then(() => {
    // show success if update is successful
    console.log("Successfully Inserted");
    // Show the prompts again
    userPrompts();
    // Log any error that occurs
  }).catch(console.error);
}

// Function to add a department
function add_a_department() {
  // Use inquirer to get user input
  inquirer.prompt([{
    type: "input",
    name: "department",
    message: "What is the department that you want to add?"
  }]).then(response => {
    // Query the database to add a department
    return connection.query('INSERT INTO department (name) VALUES (?)', [response.department]);
  }).then(() => {
    // show success if update is successful
    console.log("Successfully Inserted");
    // Show the prompts again
    userPrompts();
    // Log any error that occurs
  }).catch(console.error);
}

// Function to add a role
function add_a_role() {
  // Use inquirer to get user input
  inquirer.prompt([{
    message: "enter title:",
    type: "input",
    name: "title"
  }, {
    message: "enter salary:",
    type: "number",
    name: "salary"
  }, {
    message: "enter department ID:",
    type: "number",
    name: "department_id"
  }]).then(response => {
    // Query the database to add a role
    return connection.query("INSERT INTO role (title, salary, department_id) values (?, ?, ?)", [response.title, response.salary, response.department_id]);
  }).then(([rows]) => {
    // Display the roles in a well formatted table
    console.table(rows);
    // Show the prompts again
    userPrompts();
    // Log any error that occurs
  }).catch(console.error);
}

// Function to update an employee role
function update_an_employee_role() {
  // Use inquirer to get user input
  inquirer.prompt([{
    message: "which employee would you like to update? (use first name only for now)",
    type: "input",
    name: "name"
  }, {
    message: "enter the new role ID:",
    type: "number",
    name: "role_id"
  }]).then(response => {
    // Query the database to update an employee role
    return connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.name]);
  }).then(([rows]) => {
    // Display the employees in a well formatted table
    console.table(rows);
    // Show the prompts again
    userPrompts();
    // Log any error that occurs
  }).catch(console.error);
}

// Initialize database and start the application
initializeDatabase();