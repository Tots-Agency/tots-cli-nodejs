#! /usr/bin/env node

import { Command } from 'commander';
import { input, editor } from '@inquirer/prompts';
import { ModelGenerator } from './generators/model.generator.mjs';
//import { ModelGenerator } from './generators/model.generator';

const program = new Command();

program
  .name('tots-cli')
  .description('CLI to some NodeJs utilities')
  .version('0.0.1');

program.command('crud')
  .description('Create automatically a CRUD')
  .action(async () => {

    const name = await input({ message: 'What is the name of the model?' });
    const json = await editor({ message: 'Copy JSON migration' });
      
    console.log(name);

  });

  program.command('g model')
  .description('Create automatically a Model')
  .action(async () => {

    const name = await input({ message: 'What is the name of the model?' });
    const table = await input({ message: 'What is the table of the model?' });
    const json = await editor({ message: 'Copy JSON migration' });

    let generator = new ModelGenerator(name, table, json);
    generator.generate();

  });

program.command('split')
  .description('Split a string into substrings and display as an array')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });

program.parse();