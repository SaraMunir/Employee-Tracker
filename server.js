require('events').EventEmitter.defaultMaxListeners = 40;
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
    database: "employee_tracker"
});
async function main(){
    let departmentList = await db.query( `SELECT * FROM employee_tracker.department;`)
    let roleList = await db.query( `SELECT * FROM employee_tracker.role;`)
    let employee = await db.query( `SELECT * FROM employee_tracker.employee;`)
    let employeesList = await db.query( `SELECT * FROM employee_tracker.employee;`)
    let employeeNameList = await db.query( `SELECT employee_id, CONCAT( first_name, " ", last_name ) AS fullname FROM employee_tracker.employee;`);
    // console.log(employeeNameList[0].fullname);
    // console.log(departmentList);
    let newEmployeeNameList = [];
    let employeeInfor = [];
    for (var i=0; i<employeeNameList.length; i++){
        var employeeObj = {
            emp_fullname: employeeNameList[i].fullname,
            emp_id: employeeNameList[i].employee_id
        }
        employeeInfor.push(employeeObj);
        newEmployeeNameList.push('id: ' + employeeObj.emp_id +' '+ employeeObj.emp_fullname);
    }
    let departmentNameList = [];
    for (var i=0; i<departmentList.length; i++){
        var department = departmentList[i].name;
        var department_id = departmentList[i].department_id;
        departmentNameList.push(department_id + ' ' + department);
    }
    // console.log(departmentNameList)

    let roleNameList = [];
    for (var i=0; i<roleList.length; i++){
        var role = roleList[i].title;
        var role_id = roleList[i].role_id;
        roleNameList.push(role_id + ' ' + role);
    }
    // console.log(employee);
    // console.log(employeeName);
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
                } else {
                    process.exit(0);
                }
    }
    const userActivityType = await inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "whatToDo",
                choices: ['View','Add', 'Update', 'Remove']
            }
        ])
    var whatToDo = userActivityType.whatToDo;
        switch(whatToDo){
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
                        const userResNewDept = await inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "What is the name of the New Department?",
                                name: "departmentName",
                            }
                        ])
                        await db.query( `INSERT INTO department (name) VALUES(?);`, [userResNewDept.departmentName] )
                        showMenu();
                        break;
                    case "Roles":
                        const userResNewRole = await inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "What is the name of the New Role?",
                                name: "newRoleTitle",
                            },
                            {
                                type: "input",
                                message: "What is the salary of the Role?",
                                name: "newRoleSalary",
                            },
                            {
                                type: "list",
                                message: "Select the department of the role ",
                                name: "newRoleDept2",
                                choices: departmentNameList
                            }
                        ])
                        var newRoleDept2 = userResNewRole.newRoleDept2;
                        var newRoleDeptIdArray = newRoleDept2.split(" ");
                        var newRoleDeptId = newRoleDeptIdArray[0];
                        await db.query( `INSERT INTO role (title, salary,department_id) VALUES(?,?,?);`, [userResNewRole.newRoleTitle, userResNewRole.newRoleSalary, newRoleDeptId] )
                        console.log('new role added: ', userResNewRole.newRoleTitle);
                        showMenu();
                        break;
                    case "Employees":
                        const userResNewEmployee = await inquirer
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
                                type: "list",
                                message: "Select Employees role",
                                name: "employeeRole",
                                choices: roleNameList
                            }
                        ])

                        var employeeRole = userResNewEmployee.employeeRole
                        console.log(employeeRole)
                        var employeeRole = employeeRole.split(" ");
                        var role_id = employeeRole[0];
                        console.log(role_id);

                        await db.query( `INSERT INTO employee (first_name, last_name, role_id) VALUES(?, ?, ?);`, [userResNewEmployee.employeeFirstName,  userResNewEmployee.employeeLastName, role_id] )
                        console.log('new employee: ' + userResNewEmployee.employeeFirstName + ' ' + userResNewEmployee.employeeLastName + '. role id of ' + role_id + ' has been added to the database.');
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
                        choices: [
                            'View all Departments', 
                            'View all Roles', 
                            'View all Employees',
                            'View Employees by Department',
                            'View Employees by Role',
                            'view All'
                        ]}])
            //==== View Options
                const whatToView = userResView.whatToView;
                switch(whatToView){
                    case "View all Departments":
                        console.table(departmentList);
                        showMenu()
                        break;
                    case "View all Roles":
                        console.table(roleList);
                        showMenu();
                        break;
                    case "View all Employees":
                        console.table(employee);
                        showMenu();
                        break;
                    case "View Employees by Department":
                        const emplByDept = await inquirer
                        .prompt([{
                                type: "list",
                                message: "Which department would you like to view?",
                                name: "whichDeptToView",
                                choices: departmentNameList
                                }])
                        let depToView = await db.query(`SELECT department.name,employee.first_name,employee.last_name,role.title FROM department,role,employee WHERE department.department_id=role.department_id AND role.role_id=employee.role_id AND department.name = ?;`, [emplByDept.whichDeptToView])
                        console.table(depToView);
                        showMenu();
                        break;
                    case "View Employees by Role":
                    const emplByRole = await inquirer
                    .prompt([{
                            type: "list",
                            message: "Which role would you like to view?",
                            name: "whichRoleToView",
                            choices: roleNameList
                            }])

                        var respEmplByRole = emplByRole.whichRoleToView;
                        var respEmplByRoleArray = respEmplByRole.split(" ");

                        console.log(emplByRole.whichRoleToView);
                        newEmplByRole = await db.query(`SELECT role.title, employee.first_name, employee.last_name, role.salary FROM role,employee,department WHERE role.role_id=employee.role_id AND department.department_id=role.department_id AND role.role_id = ?;`, [respEmplByRoleArray[0]])
                        console.table(newEmplByRole)
                        showMenu();
                        break;
                    case "view All":
                        let allDatabase = await db.query(`SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.role_id LEFT JOIN department ON role.department_id = department.department_id;`)
                        console.table(allDatabase);
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
                        choices: newEmployeeNameList
                    }
                    ,
                    {
                        type: "list",
                        message: "What role would you like to set for the employee?",
                        name: "employeeRoleToUpdate",
                        choices: roleNameList
                    },
                    
                ])
                const employeeToUpdate = userResUpd.employeeToUpdate;
                const employeeRoleToUpdate = userResUpd.employeeRoleToUpdate;


                var employeeToUpdateArray = employeeToUpdate.split(" ");
                var emp_id = employeeToUpdateArray[1]
                var empRoleToUpdtArray = employeeRoleToUpdate.split(" ");
                var empRole_id = empRoleToUpdtArray[0];

                let newEmpRole = await db.query(`UPDATE employee SET role_id = ? WHERE employee_id = ?;`, [empRole_id, emp_id])

                console.log( `employee role has been updated`)
                showMenu();
                break;
        //=========new View
            case "Remove": 
                const userResRemv = await inquirer
                .prompt([
                    {
                        type: "list",
                        message: "What section would you like to edit",
                        name: "sectionToRemv",
                        choices: ['Departments', 'Roles', 'Employees']
                    }
                ])
                const sectionToRemv = userResRemv.sectionToRemv;
                    switch(sectionToRemv){
                        case "Departments":
                            const userResDelDept = await inquirer
                                .prompt([
                                    {
                                        type: "list",
                                        message: "Which department would you like to delete",
                                        name: "departmentToDelete",
                                        choices: departmentNameList
                                    }
                                ])
                                await db.query(`DELETE FROM department WHERE name = ?;`, [userResDelDept.departmentToDelete])
                                console.log(`${userResDelDept.departmentToDelete} has been deleted successfully`)
                            showMenu()
                            break;
                        case "Roles":
                            const userResDelRoles = await inquirer
                                .prompt([
                                    {
                                        type: "list",
                                        message: "Which role would you like to delete",
                                        name: "roleToDelete",
                                        choices: roleNameList
                                    }
                                ])
                                var roletodeleteStr = userResDelRoles.roleToDelete
                                var role_id = roletodeleteStr[0];
                                console.log(role_id);
                                // var roleTitle= roleArray[1]+roleArray[2]
                                // console.log( role_id + roleTitle)
                                await db.query(`DELETE FROM role WHERE (role_id = ? );`, [role_id])
                                console.log(`${userResDelRoles.roleToDelete} has been deleted successfully`)
                            showMenu();
                            break;
                        case "Employees":

                            const userResDelEmployees = await inquirer
                                .prompt([
                                    {
                                        type: "list",
                                        message: "Which employee would you like to delete",
                                        name: "employeeToDelete",
                                        choices: newEmployeeNameList
                                    }
                                ])
                                var employeeToDelete = userResDelEmployees.employeeToDelete
                                console.log(employeeToDelete);
                                var nameArray = employeeToDelete.split(" ");
                                var emp_id = nameArray[1]
                                var first_name= nameArray[2]
                                var last_name= nameArray[3]
                                await db.query(`DELETE FROM employee WHERE first_name = ? AND last_name = ? AND employee_id = ?;`, [first_name, last_name, emp_id])
                                
                                console.log(`${employeeToDelete} has been deleted successfully`)
                            showMenu();
                            break;
                        };
                break;
            };
            //==== View
    
    // runSwitchToDo();
}
main();