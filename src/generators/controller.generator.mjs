import { BaseGenerator } from "./base.generator.mjs";

export class ControllerGenerator extends BaseGenerator {

    folderPath = 'src/controllers';
    modelName = '';

    constructor(modelName) {
      super();
      this.modelName = modelName;
    }

    generate() {
      let modelFile = this.fileContent;
      modelFile = modelFile.replace(/{{modelClass}}/g, this.modelName);
      modelFile = modelFile.replace(/{{modelFile}}/g, BaseGenerator.camelToSnakeCase(this.modelName));

      this.writeFile(this.folderPath, BaseGenerator.camelToSnakeCase(this.modelName) + '.controller.ts', modelFile);
    }

    fileContent = `import { Body, Controller, Delete, Get, Param, Patch, Post, Request, Query } from '@nestjs/common';
    import { TotsSequelizeQuery } from '@tots/sequelize-query';
    import { plainToClass, plainToInstance } from 'class-transformer';
    import { SuccessDto } from '@tots/core-node';
    import { {{modelClass}}Dto } from 'src/dtos/{{modelFile}}.dto';
    import { {{modelClass}} } from 'src/models/{{modelFile}}.model';
    import { {{modelClass}}Repository } from 'src/repositories/{{modelFile}}.repository';
    
    @Controller('{{modelFile}}')
    export class {{modelClass}}Controller {
    
      constructor(private readonly repository: {{modelClass}}Repository) {}
    
      @Post()
      async create(@Body() request: {{modelClass}}Dto, @Request() req: any) {
        let dto: {{modelClass}}Dto = plainToClass({{modelClass}}Dto, request);
        let item: {{modelClass}} = await this.repository.create(dto);
        return {{modelClass}}Dto.fromModel(item);
      }
    
      @Get()
      async findAll(@Query('page') page: number = 1, @Query('per_page') pageSize: number = 10, @Query('filters') filters: string = '', @Request() req: any) {
        let filter = new TotsSequelizeQuery(this.repository.getModel(), filters);
        return await filter.paginate(+page, +pageSize);
      }
    
      @Get(':id')
      async findOne(@Param('id') id: string, @Request() req: any) {
        let item: {{modelClass}} = await this.repository.findByIdOrFail(+id);
        return {{modelClass}}Dto.fromModel(item);
      }
    
      @Patch(':id')
      async update(@Param('id') id: string, @Body() update: {{modelClass}}Dto, @Request() req: any) {
        let item: {{modelClass}} = await this.repository.update(+id, update);
        return {{modelClass}}Dto.fromModel(item);
      }
    
      @Delete(':id')
      async remove(@Param('id') id: string, @Request() req: any) {
        await this.repository.removeById(+id);
        return new SuccessDto();
      }
    }
    `;
}