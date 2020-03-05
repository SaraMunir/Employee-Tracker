const inquirer = require("inquirer");
// var fs = require('fs')
const mysql = require( 'mysql' );
class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args=[] ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}
// at top INIT DB connection
const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1234",
    database: "pictures"
});
async function main(){
    let departmentList = [
        { name: 'Sales Department1', id: 1 },
        { name: 'HR Department2', id: 2 },
        { name: 'Service Department3', id: 3 },
        { name: 'Audit Department3', id: 4 }
    ];
    let roleList = [
        { title: 'manager', salary: '$6000', id: 1},
        { title: 'supervisor', salary: '$4000', id: 2},
        { title: 'agent', salary: '$2500', id: 3},
    ];
    let employee = [
        {
            first_name: 'Tahmina',
            last_name: 'Shorna',
            role: 'supervisor',
            id: 1
        },
        {
            first_name: 'Sara',
            last_name: 'Munir',
            role: 'agent',
            id: 2
        },
        {
            first_name: 'Norma',
            last_name: 'Moras',
            role: 'agent',
            id: 3
        }
    ];
    let employeeName = [];
    for (var i=0; i<employee.length; i++){
        var fullName = employee[i].first_name + ' ' + employee[i].last_name;
        employeeName.push(fullName);
    }
    async function showMenu(){
        const userShowMenu = await inquirer.prompt([
            {
                name: 'back',
                type: 'list',
                message: 'Would you like to view the menu again?',
                choices: ['yes', 'no'],
            }])
            if (userShowMenu.back === 'yes'){
                    return main();
                }
    }
    const userActivityType = await inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "whatToDo",
                choices: ['Add', 'View', 'Update']
            }
        ])
    var whatToDo = userActivityType.whatToDo;
    async function runSwitchToDo(){
        switch(whatToDo)
            {
            //==== Add
            case "Add": 
                const userResAdd = await inquirer.prompt([
                    {
                        type: "list",
                        message: "What would you like to add?",
                        name: "whatToAdd",
                        choices: ['Departments', 'Roles', 'Employees']
                    }
                ])
                const whatToAdd = userResAdd.whatToAdd;
                console.log(whatToAdd);
            //=========Add Options
                switch(whatToAdd){
                    case "Departments":
                        const userResDept = await inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "What is the name of the New Department?",
                                name: "departmentName",
                            }
                        ])
                        const departmentName = userResDept.departmentName;
                        await $.post('/api/add_Department', departmentName)
                        console.log(departmentName);
                        showMenu();
                        break;
                    case "Roles":
                        const userResRoles = await inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "What is the name of the New Role?",
                                name: "newRole",
                            }
                        ])
                        const newRole = userResRoles.newRole;
                        console.log(newRole);
                        showMenu();
                        break;
                    case "Employees":
                        const userResEmployees = await inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "What is the first name of the New Employee?",
                                name: "employeeFirstName",
                            },
                            {
                                type: "input",
                                message: "What is the last name of the New Employee?",
                                name: "employeeLastName",
                            },
                            {
                                type: "input",
                                message: "What is the role id of the New Employee?",
                                name: "employeeRoleId",
                            }
                        ])
                        const employeeFirstName = userResEmployees.employeeFirstName;
                        const employeeLastName = userResEmployees.employeeLastName;
                        const employeeRoleId = userResEmployees.employeeRoleId;
                        console.log('employe name & id: ' + employeeFirstName + ' ' + employeeLastName + ' ' + employeeRoleId);
                        showMenu();
                        break;
                    }
                break;
        //=========new View
            case "View":
                const userResView = await inquirer
                .prompt([{
                        type: "list",
                        message: "What would you like to view?",
                        name: "whatToView",
                        choices: ['Departments', 'Roles', 'Employees']}])
            //==== View Options
                const whatToView = userResView.whatToView;
                switch(whatToView){
                    case "Departments":
                        console.table(departmentList);
                        showMenu()
                        
                        break;
                    case "Roles":
                        console.table(roleList);
                        showMenu();

                        break;
                    case "Employees":
                        console.table(employee);
                        showMenu();

                        break;
                    };
                break;        
        //=========new View
            case "Update": 
                const userResUpd = await inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Which Employee would you like to update?",
                        name: "employeeToUpdate",
                        choices: employeeName
                    }
                ])
                const employeeToUpdate = userResUpd.employeeToUpdate;
                console.log(employeeToUpdate)
                showMenu();

                break;
            };
            //==== View
    }
    runSwitchToDo();
}
main();
