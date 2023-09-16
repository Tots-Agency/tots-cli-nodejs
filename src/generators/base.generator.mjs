import fs from 'fs';
import path from 'path';

export class BaseGenerator {
    readFile(filePath) {
        return fs.readFileSync(filePath, 'utf8');
    }

    writeFile(folderPath, fileName, content) {
        // Asegúrate de que la carpeta exista, o créala si no existe
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true }); // La opción recursive:true crea directorios padres si no existen
        }

        fs.writeFileSync(path.join(folderPath, fileName), content);
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

    static camelToSnakeCase(input) {
        let str = input;
        str = str[0].toLowerCase() + str.slice(1, str.length).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        str  = str.replaceAll(" _","_")

        return str.replaceAll(" ","_").replace(/(^_*|_*$)/g, '');
    }
}