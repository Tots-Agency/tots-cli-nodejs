#! /usr/bin/env node
import { Command } from 'commander';
import { input, editor } from '@inquirer/prompts';
import { ModelGenerator } from './generators/model.generator.mjs';
import { DtoGenerator } from './generators/dto.generator.mjs';
import { RepositoryGenerator } from './generators/repository.generator.mjs';
import { ControllerGenerator } from './generators/controller.generator.mjs';

const program = new Command();

program
  .name('tots-cli')
  .description('CLI to some NodeJs utilities')
  .version('0.0.1');

program.command('crud')
  .description('Create automatically a CRUD')
  .action(async () => {

    const name = await input({ message: 'What is the name of the model?' });
    const table = await input({ message: 'What is the table of the model?' });
    const json = await editor({ message: 'Copy JSON migration' });

    new ModelGenerator(name, table, json).generate();
    new DtoGenerator(name, json).generate();
    new RepositoryGenerator(name).generate();
    new ControllerGenerator(name).generate();

  });

program.command('model')
  .description('Create automatically a Model')
  .action(async () => {

    const name = await input({ message: 'What is the name of the model?' });
    const table = await input({ message: 'What is the table of the model?' });
    const json = await editor({ message: 'Copy JSON migration' });

    let generator = new ModelGenerator(name, table, json);
    generator.generate();

  });

  program.command('dto')
  .description('Create automatically a DTO')
  .action(async () => {

    const name = await input({ message: 'What is the name of the model?' });
    const json = await editor({ message: 'Copy JSON migration' });

    let generator = new DtoGenerator(name, json);
    generator.generate();

  });

program.command('repository')
  .description('Create automatically a Repository')
  .action(async () => {

    const name = await input({ message: 'What is the name of the model?' });

    let generator = new RepositoryGenerator(name);
    generator.generate();

  });

program.command('controller')
  .description('Create automatically a Repository')
  .action(async () => {

    const name = await input({ message: 'What is the name of the model?' });

    let generator = new ControllerGenerator(name);
    generator.generate();

  });

program.parse();