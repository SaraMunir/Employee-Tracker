# Employee-Tracker
The objective of the project was to architect and build a solution for managing a company's employees using node, inquirer, and MySQL. The challenge is to build a command-line application that at a minimum allows the user to:

    * Add departments, roles, employees
    * View departments, roles, employees
    * Update employee roles

## Instructions

A database schema containing three tables is created as follows:

![Database Schema](assets/schema.png)


## Installation
In order to run the program the following packages has to be installed
    * Inquirer
    * Mysql

## Basic Structure of the application
### Start Menu
The application has four basic options that the user has to choose when it is run. 
* > View
* > Add
* > Update
* > Remove

 ![Start menu](assets/Start_Menu.png)

## View

Under the view option the user can access the following choices:

    * View all Departments
    * View all Roles
    * View all Employees
    * View Employees by Department
    * View Employees by Role
    * view All

![View menu](assets/view_Menu.png)

### example of the view options working

![Employee Tracker](assets/View_functions-1.gif)
![Employee Tracker](assets/View_functions-2.gif)

## Add

Under the add option the user can access the following choices:

    * Departments
    * Roles
    * Employees

### Examples

#### The Add department Scenario
![View menu](assets/add_department_example.png)

#### The Add role Scenario
![View menu](assets/add_role_example.png)

#### The Add employee Scenario
![View menu](assets/Add_Employee.gif)


