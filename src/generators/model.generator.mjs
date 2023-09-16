import { BaseGenerator } from "./base.generator.mjs";

export class ModelGenerator extends BaseGenerator {
    filePath = './files/model.txt';
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
    
    generate() {
      let modelFile = this.readFile(this.filePath);
      modelFile = modelFile.replace(/{{table}}/g, 'product');
      modelFile = modelFile.replace(/{{modelClass}}/g, 'Product');

      this.writeFile(this.folderPath, 'product.ts', modelFile);
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
}



/*const jsonString = `{
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstname: {
      type: Sequelize.STRING
    },
    lastname: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.TEXT
    },
    photo: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING(50)
    },
    role: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    is_notification: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    caption: {
      type: Sequelize.TEXT
    },
    timezone: {
      type: Sequelize.STRING(50)
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
    deleted_at:{
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    }
}`;

  const jsonStringValido = jsonString
  .replace(/([a-zA-Z_]+)(\s*):/g, '"$1":')
  .replace(/Sequelize.INTEGER\(1\)/g, '"tiny_integer"')
  .replace(/Sequelize.INTEGER/g, '"integer"')
  .replace(/Sequelize.TEXT/g, '"text"')
  .replace(/Sequelize.DATE/g, '"date"')
  .replace(/Sequelize.STRING\(50\)/g, '"string"')
  .replace(/Sequelize.STRING/g, '"string"');
  //console.log(jsonStringValido);
  const jsonObject = JSON.parse(jsonStringValido);
  //console.log(jsonObject);

let modelFile = fs.readFileSync(filePath, 'utf8');
modelFile = modelFile.replace(/{{table}}/g, 'product');
modelFile = modelFile.replace(/{{modelClass}}/g, 'Product');

// Asegúrate de que la carpeta exista, o créala si no existe
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true }); // La opción recursive:true crea directorios padres si no existen
}

fs.writeFileSync(path.join(folderPath, 'product.ts'), modelFile);
console.log(modelFile);*/