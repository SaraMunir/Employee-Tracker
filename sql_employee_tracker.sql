CREATE DATABASE employee_tracker;
DROP DATABASE employee_tracker;

USE employee_tracker;
CREATE TABLE department (
department_id INT PRIMARY KEY auto_increment,
name VARCHAR(30) NOT NULL
);
DROP TABLE department;
DROP TABLE role;
DROP TABLE role;
CREATE TABLE role (
role_id INT PRIMARY KEY auto_increment ,
title VARCHAR(30) NOT NULL,
salary DECIMAL,
department_id INT,
FOREIGN KEY (department_id) REFERENCES department(department_id)
);
CREATE TABLE employee (
employee_id INT PRIMARY KEY auto_increment,
first_name VARCHAR(30) NOT NULL ,
last_name VARCHAR(30) NOT NULL,
role_id INT,
FOREIGN KEY (role_id) REFERENCES role(role_id)
);

INSERT INTO department (name) VALUES('HR');
INSERT INTO department (name) VALUES('Accounts');
INSERT INTO role (title, salary,department_id) VALUES('Accountant', '5000', '1' );
INSERT INTO role (title, salary,department_id) VALUES('Accounts Manager', '6000', '1' );
INSERT INTO role (title, salary,department_id) VALUES('HR Manager', '10000', '2' );
INSERT INTO role (title, salary,department_id) VALUES('Recruiting Manager', '10000', '2' );
INSERT INTO employee (first_name, last_name, role_id) VALUES('joana', 'santosh', '1' );
INSERT INTO employee (first_name, last_name, role_id) VALUES('Norma', 'Moras', '3' );


SELECT * FROM employee 
LEFT JOIN role ON employee.role_id = role.role_id
LEFT JOIN department ON role.department_id = department.department_id
;
CREATE TABLE new_table SELECT * FROM role 
LEFT JOIN department ON role.department_id = department.department_id
;
SELECT * FROM new_table 

SELECT employee_id, CONCAT( first_name, " ", last_name ) AS fullname 
FROM employee_tracker.employee;