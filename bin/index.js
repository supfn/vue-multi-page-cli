#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const packageJson = require('../package.json');

program.version(packageJson.version, '-v, --version')
  .command('init <name>')
  .action((name) => {
    if(!fs.existsSync(name)){
      inquirer.prompt([
        {
          name: 'description',
          message: 'Enter a project description'
        },
        {
          name: 'author',
          message: 'Enter author name'
        }
      ]).then((answers) => {
        const spinner = ora('download ...');
        spinner.start();
        download('github:supfn/vue-multi-page-template#master', name, {clone: true}, (err) => {
          if(err){
            spinner.fail();
            console.log(symbols.error, chalk.red(err));
          }else{
            spinner.succeed();
            const fileName = `${name}/package.json`;
            const meta = {
              name,
              description: answers.description,
              author: answers.author
            };
            if(fs.existsSync(fileName)){
              const content = fs.readFileSync(fileName).toString();
              const result = handlebars.compile(content)(meta);
              fs.writeFileSync(fileName, result);
            }
            console.log(symbols.success, chalk.green('Project initialization is complete'));
          }
        })
      })
    }else{
      console.log(symbols.error, chalk.red(`'${name}' already exists`));
    }
  });
program.parse(process.argv);
