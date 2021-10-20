const chalk = require("chalk");
const client = require("../index");

client.on("ready", () =>{
    console.log(chalk.green.bold(`${client.user.tag} is up and ready to go!`));
});
