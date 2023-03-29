import { fileURLToPath } from 'url';
import path from 'path';

import {ClassRMWfile} from '../module/ModuleRMWfile.mjs';
import config from './config.json' assert { type: 'json' };

async function run(){
    const pathfile = process.argv[2];
    

    const obj_regexp = {
        reg1: {
                RegExp: /\/\/.*|\/\*[^]*?\*\//g,
                NewStr: ''
        },
        reg2: {
                RegExp: /\r\n\s{0,}\r\n/g,
                NewStr:'\r\n'
        }
};
    const delcom = new ClassRMWfile(pathfile, obj_regexp, config);
        
    delcom.__filename = fileURLToPath(import.meta.url); //полный путь к исполняемому файла
    delcom.__dirname  = path.dirname(delcom.__filename); //путь до исполняемого файла
    delcom.__name     = path.basename(delcom.__filename); //имя исполняемого файла с расширением
    delcom.__ext      = path.extname(delcom.__filename, ''); //имя исполняемого файла с расширением

    delcom.TemplatePrefix = config;
    
    delcom.RMWfile(); //запустить основной метод
}
//**********************RUNTIME***************************/
/*
 Пример запуска программы с аргументами из директории с программой ниже.
 В качестве 
 node --no-warnings delete-com.mjs "c:\Programming\Nodejs\UtilsProject\js\app\ModuleBuzzer.js"
 обрабатываемый файл (в данном примере): ModuleBuzzer.js,
 результирующий файл (в данном примере): ModuleBuzzer-nc.js
*/
run(); //очистить файл от комментариев и пустых строк