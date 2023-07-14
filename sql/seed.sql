USE employee_db;

INSERT INTO department (name)
VALUES ("Marketing");
INSERT INTO department (name)
VALUES ("Research");
INSERT INTO department (name)
VALUES ("Human Resources");
INSERT INTO department (name)
VALUES ("Operations");

INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Coordinator", 75000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Research Analyst", 80000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("HR Specialist", 85000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Operations Manager", 95000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("Operations Associate", 70000, 4);

-- Inserting managers first (assuming Emily and Sarah are managers)
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Emily", "Johnson", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sarah", "Taylor", 5, null);

-- Now other employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 1); -- Assuming John reports to Emily
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Smith", 2, 2); -- Assuming Jane reports to Sarah
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("David", "Brown", 4, 1); -- Assuming David reports to Emily
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Robert", "Miller", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Emma", "Davis", 4, 2); -- Assuming Emma reports to Sarah
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("James", "Wilson", 1, 1); -- Assuming James reports to Emily
