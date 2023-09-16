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
}