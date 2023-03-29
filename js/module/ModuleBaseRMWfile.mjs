import * as fsp from "node:fs/promises"; //поддержка fs в режиме promises
import * as fs from "node:fs"; //поддержка fs в режиме callback и sync 
import { constants } from "node:fs"; //импортируем константы fs
import path from 'path'; //поддержка работы с путями
import { fileURLToPath } from 'url';

/**
 * @class
 * 
 * Класс ClassRMWfile предоставляет базовые операции для реализации модулей
 * работающих с файлами и предназначенными для выполнения паттерна операций:
 *  -> ЧТЕНИЕ-МОДИФИКАЦИЯ-ЗАПИСЬ (RMW)
 * Класс предназначен только для наследования и не истанцируется.
 */
class ClassBaseRMWfile {
    /**
     * @constructor
     * @param {String} _path - полный путь к обрабатываемому файлу 
     * @param {Object} _objRegExp - литеральный объект содержащий пары: "рег. выражение-строка замена"
     */
    constructor(_path, _objRegExp, _config){
        this._Path = _path; //хранит полный путь к исходному файлу
        this._Data = ''; //буфер для хранения данных исходного файла
        this._Dir = path.dirname(this._Path);  //путь к директории с исходным файлом
        this._Name = path.basename(this._Path);//имя исходного файла
        this._Ext = path.extname(this._Path);  //расширение исходного файла

        this.__filename = ''; //полный путь к исполняемому файла
        this.__dirname  = ''; //путь до исполняемого файла
        this.__name     = ''; //имя исполняемого файла с расширением
        this.__ext      = ''; //расширение исполняемого файла

        this._TemplateRegExp = []; //массив объектов хранящих пару: регулярное выражение + строку замены
        this._TemplatePrefix = ''; //строка содержащая литерал добавляемый к имени исходного файла при сохранении

        this._FlagOperationAllowed = false; //флаг блокирующий операции с файловой системой, на старте операции запрещены

        for (let key in _objRegExp) {
            this._TemplateRegExp.push(_objRegExp[key]);//добавить пары "рег выражение-строка на замену"
        }
    }
    /**
     * @method
     * Сеттер перебирает переданный ему JSON объект, находит там поле относящеееся к данной программе
     * (по имени исполняемого файла) и присваивает значение соответствующему полю
     */
    set TemplatePrefix(_config){
        const name = this.__name.replace(this.__ext, ''); //имя без расширения
            for (let key in _config) {
                /*debughome*/ const temp = String(key); /*debugend*/
                if ( String(key).includes(name) ) {
                    this._TemplatePrefix += _config[key];
                        break;
                }
            }
    }
    /**
     * @method
     * Метод выполняет чтение содержимого файла. Используется promises версия readFile.
     * Данные записываются в поле объекта
     */
    async Read() {
        try {
            await fsp.access(this._Path, constants.R_OK); //проверить доступ на чтение файла
            
            this._Data = await fsp.readFile(this._Path, { encoding: "utf-8" }); //считать данные
        
            this._FlagOperationAllowed = true; //разрешить последующие операции
                console.log(`Info>> Данные успешно прочитаны из файла`);
                    return true; //операция успешно выполнена
        } catch(err) {
            console.log(`Error>> File does not exist !${'\n'}Оriginal mes: "${err}"`);
                return false; //операция завершилась не удачей
        }
    }
    /**
     * @method
     * Метод выполняет удаление всех типов комментариев из текстового буфера
     * и там же сохраняет результат.
     */
    Modify() {
        try {
            if(!this._FlagOperationAllowed){throw `Error>> _FlagOperationAllowed: false`;}

            this._TemplateRegExp.forEach( (element)=>{
                this._Data = this._Data.replace(element.RegExp, element.NewStr); //обработать исх файл регулярками
            });

        console.log(`Info>> Обработка файла завершена`);
            return true; //операция успешно выполнена

        } catch(err){
            this._FlagOperationAllowed = false;
                console.log(`Error>> Modification operation is prohibited !${'\n'}Оriginal mes: "${err}"`);
                    return false; //операция завершилась не удачей
        }
    }
    /**
     * @method
     * Метод записывает обработанные данные в новый файл, имя создаваемого файла отличается
     * дополнительным шаблоном. Используется promises версия writeFile.
     * Исходный файл не модифицируется.
     */
    async Write() {
        try {
            if(!this._FlagOperationAllowed){throw `Error>> _FlagOperationAllowed: false`;}
            /*debughome*/
            const dir = path.dirname(this._Path);  //путь к директории с исходным файлом
            const name = path.basename(this._Path);//имя исходного файла
            const ext = path.extname(this._Path);  //расширение исходного файла
            
                //console.log(`Значения переменных,this._Dir ${dir}${'\n'}name: ${name}${'\n'}ext: ${ext}`);
            /*debugend*/

            const new_name = this._Name.replace(this._Ext, this._TemplatePrefix+this._Ext); //имя итогового файла
            const new_path = this._Dir+'\\'+new_name; //полный путь с именем итогового файла
            
            await fsp.writeFile(new_path, this._Data, {encoding: "utf8"}); //записать результат в итоговый файл
            
            console.log(`Info>> Копия файла сохранена`);
                return true; //операция успешно выполнена

        } catch(err) {
            this._FlagOperationAllowed = false;
                console.log(`Error>> Recording failed !${'\n'}Оriginal mes: "${err}"`);
                    return false; //операция завершилась не удачей
        }   
    }
}
export { ClassBaseRMWfile };