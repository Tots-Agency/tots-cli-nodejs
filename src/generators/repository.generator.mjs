import { BaseGenerator } from "./base.generator.mjs";

export class RepositoryGenerator extends BaseGenerator {

    folderPath = 'src/repositories';
    modelName = '';

    constructor(modelName) {
      super();
      this.modelName = modelName;
    }

    generate() {
      let modelFile = this.fileContent;
      modelFile = modelFile.replace(/{{modelClass}}/g, this.modelName);
      modelFile = modelFile.replace(/{{modelFile}}/g, BaseGenerator.camelToSnakeCase(this.modelName));

      this.writeFile(this.folderPath, BaseGenerator.camelToSnakeCase(this.modelName) + '.repository.ts', modelFile);
    }

    fileContent = `import { Injectable } from '@nestjs/common';
    import { InjectModel } from '@nestjs/sequelize';
    import { classToPlain, instanceToPlain } from 'class-transformer';
    import { {{modelClass}}Dto } from 'src/dtos/{{modelFile}}.dto';
    import { {{modelClass}} } from 'src/models/{{modelFile}}.model';
    
    @Injectable()
    export class {{modelClass}}Repository {
        constructor(
            @InjectModel({{modelClass}}) private model: typeof {{modelClass}},
        ) {}
    
        create(data: {{modelClass}}Dto): Promise<{{modelClass}}> {
            return {{modelClass}}.create(instanceToPlain(data));
        }

        async update(id: number, data: {{modelClass}}Dto): Promise<{{modelClass}}> {
            data.id = undefined;
            let item = await this.findById(id);
            item.set(data);
            return item.save();
        }
    
        findById(id: number): Promise<{{modelClass}}> {
            return this.model.findOne({ where: { id } });
        }
    
        async findByIdOrFail(id: number): Promise<{{modelClass}}> {
            let item = await this.findById(id);
            if(item === null) {
                throw new Error('Item not found');
            }
            return item;
        }
    
        async removeById(id: number): Promise<void> {
            let item = await this.findByIdOrFail(id);
            return item.destroy();
        }
    
        remove(item: {{modelClass}}): Promise<void> {
            return item.destroy();
        }
    
        getModel() {
            return this.model;
        }
    }`;
}