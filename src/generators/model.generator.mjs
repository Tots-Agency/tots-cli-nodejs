import { BaseGenerator } from "./base.generator.mjs";

export class ModelGenerator extends BaseGenerator {
    filePath = '/../../files/model.txt';
    folderPath = 'src/models';

    tableName = '';
    modelName = '';
    fields = {};

    constructor(tableName, modelName, fields) {
      super();
      this.tableName = tableName;
      this.modelName = modelName;
      this.fields = ModelGenerator.transformMigrationObjectToJson(fields);
    }

    processFields(modelFile) {
      let data = '';

      const keys = Object.keys(this.fields);
      for (const key of keys) {
        const params = this.fields[key];
        if(key == 'created_at'){
          data += this.printCreatedAt(key);
        } else if(key == 'updated_at'){
          data += this.printUpdatedAt(key);
        } else if(key == 'deleted_at'){
          data += this.printDeletedAt(key);
        } else if (params.type == 'tiny_integer') {
          data += this.printColumn(key, 'number');
        } else if (params.type == 'integer') {
          data += this.printColumn(key, 'number');
        }else {
          data += this.printColumn(key, 'string');
        }
      }

      return modelFile.replace(/{{columns}}/g, data);
    }

    printUpdatedAt(key) {
      return `      @UpdatedAt
      ${key}: Date;
    
`;
    }

    printCreatedAt(key) {
      return `      @CreatedAt
      ${key}: Date;
    
`;
    }

    printDeletedAt(key) {
      return `      @DeletedAt
      ${key}: Date;
    
`;
    }

    printColumn(key, type) {
      return `      @Column
      ${key}: ${type};
    
`;
    }
    
    generate() {
      //let modelFile = this.readFile(this.filePath);
      let modelFile = this.fileContent;
      modelFile = modelFile.replace(/{{table}}/g, this.tableName);
      modelFile = modelFile.replace(/{{modelClass}}/g, this.modelName);
      modelFile = this.processFields(modelFile);

      this.writeFile(this.folderPath, BaseGenerator.camelToSnakeCase(this.modelName) + '.model.ts', modelFile);
    }

    static transformMigrationObjectToJson(migrationObject) {
      const jsonStringValido = migrationObject
      .replace(/([a-zA-Z_]+)(\s*):/g, '"$1":')
      .replace(/Sequelize.INTEGER\(1\)/g, '"tiny_integer"')
      .replace(/Sequelize.INTEGER/g, '"integer"')
      .replace(/Sequelize.TEXT/g, '"text"')
      .replace(/Sequelize.DATE/g, '"date"')
      .replace(/Sequelize.STRING\(50\)/g, '"string"')
      .replace(/Sequelize.STRING/g, '"string"');
      return JSON.parse(jsonStringValido);
    }

    fileContent = `
    import { Column, CreatedAt, DeletedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';
    
    @Table({
        tableName: '{{table}}',
        timestamps: true,
    })
    export class {{modelClass}} extends Model {
{{columns}}
    }`;
}