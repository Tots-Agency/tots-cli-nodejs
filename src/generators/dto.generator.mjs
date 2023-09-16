import { BaseGenerator } from "./base.generator.mjs";

export class DtoGenerator extends BaseGenerator {
    folderPath = 'src/dtos';

    modelName = '';
    fields = {};

    constructor(modelName, fields) {
      super();
      this.modelName = modelName;
      this.fields = BaseGenerator.transformMigrationObjectToJson(fields);
    }

    processFields(modelFile) {
      let data = '';

      const keys = Object.keys(this.fields);
      for (const key of keys) {
        const params = this.fields[key];
        if (params.type == 'date') {
            data += this.printDate(key);
        } else if (params.type == 'tiny_integer') {
          data += this.printColumn(key, 'number');
        } else if (params.type == 'integer') {
          data += this.printColumn(key, 'number');
        } else {
          data += this.printColumn(key, 'string');
        }
      }

      return modelFile.replace(/{{fields}}/g, data);
    }

    processReturns(modelFile) {
        let data = '';

      const keys = Object.keys(this.fields);
      for (const key of keys) {
        const params = this.fields[key];
        data += this.printReturn(key);
      }

      return modelFile.replace(/{{returns}}/g, data);
    }

    printDate(key) {
      return `        ${key}?: Date;
      `;
    }

    printColumn(key, type) {
      return `        ${key}?: ${type};
      `;
    }

    printReturn(key) {
        return `                ${key}: model.${key},
        `;
      }
    
    generate() {
      let modelFile = this.fileContent;
      modelFile = modelFile.replace(/{{modelClass}}/g, this.modelName);
      modelFile = modelFile.replace(/{{modelFile}}/g, BaseGenerator.camelToSnakeCase(this.modelName));
      modelFile = this.processFields(modelFile);
      modelFile = this.processReturns(modelFile);

      this.writeFile(this.folderPath, BaseGenerator.camelToSnakeCase(this.modelName) + '.dto.ts', modelFile);
    }

    fileContent = `import { {{modelClass}} } from "src/models/{{modelFile}}.model";
    
    export class {{modelClass}}Dto {
{{fields}}
    
        static fromModel(model: {{modelClass}}): {{modelClass}}Dto {
            return {
{{returns}}
            };
        }
    }`;
}