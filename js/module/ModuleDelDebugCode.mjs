import * as fsp from "node:fs/promises"; //поддержка fs в режиме promises
import * as fs from "node:fs"; //поддержка fs в режиме callback и sync 
import { constants } from "node:fs"; //импортируем константы fs
import path from 'path'; //поддержка работы с путями
import { fileURLToPath } from 'url';

const TEMPLATE_COMMENT_REGEXP  = /\/\/.*|\/\*[^]*?\*\//g; //шаблон удаления комментариев
const TEMPLATE_NEW_LINE_REGEXP = /\r\n\s{0,}\r\n/g; //шаблон удаления пустых строк

class ClassDelDebugCode {
    constructor(_path){
        this._Path = _path; //хранит полный путь к файлу
        this._Data = ''; //буфер для хранения данных обрабатываемого файла
        this.__filename = ''; //имя исполняемого файла
        this.__dirname = ''; //путь к исполняемому файлу
    }
    /**
     * @method
     * Метод выполняет чтение содержимого файла. Используется promises версия readFile.
     * Данные записываются в поле объекта
     */
    async #ReadData() {
        try {
            this.__filename = fileURLToPath(import.meta.url);
            this.__dirname = path.dirname(this.__filename);
        
            this._Data = await fsp.readFile(this._Path, { encoding: "utf-8" });
        
            console.log('Info>> Данные успешно прочитаны из файла');
        } catch(err) {
            console.log(`Error>> File does not exist !`);
        }
    }
    /**
     * @method
     * Метод выполняет удаление всех типов комментариев из текстового буфера
     * и там же сохраняет результат.
     */
    #DeleteComment() {
        this._Data = this._Data.replace(TEMPLATE_COMMENT_REGEXP,''); //удалить комментарии всех типов
        this._Data = this._Data.replace(TEMPLATE_NEW_LINE_REGEXP,'\r\n'); //вычистить пустые строки и зазоры

        console.log('Info>> Удаление комментариев произведено');
    }
    /**
     * @method
     * Метод записывает обработанные данные в новый файл, имя создаваемого файла отличается
     * дополнительным шаблоном. Используется promises версия writeFile.
     * Исходный файл не модифицируется.
     */
    async #WriteData() {
        const dir = path.dirname(this._Path);  //путь к директории с исходным файлом
        const name = path.basename(this._Path);//имя исходного файла
        const ext = path.extname(this._Path);  //расширение исходного файла

        const template = '-NC'; //шаблон который добавляется к исходному имени, при создании итогового файла
        
        const new_name = name.replace(ext, template+ext); //имя итогового файла
        const new_path = dir+'\\'+new_name; //полный путь с именем итогового файла
        
        await fsp.writeFile(new_path, this._Data, {encoding: "utf8"});
        console.log('Info>> Копия файла сохранена');
    }
    async ClearFile() {
        try {
            await fsp.access(this._Path, constants.R_OK); //проверить доступ на чтение файла

            await this.#ReadData(); //считать исходный код
                  this.#DeleteComment(); //удалить комментарии
            await this.#WriteData(); //сохранить результат в файл
        } catch (err) {
            console.log(`Error>> File does not exist !${'\n'}Error>> original mes: "${err}"`);
        }
    }
}

export { ClassDelDebugCode };