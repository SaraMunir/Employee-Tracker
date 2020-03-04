const inquirer = require("inquirer");
var fs = require('fs')
const axios = require("axios");

async function main(){
    const userResponse = await inquirer
    .prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "whatToDo",
            choices: ['View all Employees', '']
        }
    ])

}