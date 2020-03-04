const inquirer = require("inquirer");
var fs = require('fs')
const express = require("express");

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