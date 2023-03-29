import * as fsp from "node:fs/promises"; //поддержка fs в режиме promises
import * as fs from "node:fs"; //поддержка fs в режиме callback и sync 
import { constants } from "node:fs"; //импортируем константы fs
import path from 'path'; //поддержка работы с путями
import { fileURLToPath } from 'url';

import {ClassBaseRMWfile} from './ModuleBaseRMWfile.mjs';// импортировать базовый класс реализующий паттерн "RMW"

/**
 * @class
 * Класс ClassRMWfile наследует базовый класс ClassBaseRMWfile для выполнения
 * паттерна ЧТЕНИЕ-МОДИФИКАЦИЯ-ЗАПИСЬ и реализует прикладную логику необходимую
 * для "чистки" файлов в соответствии с заданными шаблонами на основе регулярных выражений.
 * Метод для вызова в прикладном коде - RMWfile, остальные методы класса объявлены с квалификатором private
 */
class ClassRMWfile extends ClassBaseRMWfile {
    constructor(_path, _objRegExp, _config){
        super(_path, _objRegExp, _config);
    }
    /**
     * @method
     * Метод выполняет чтение содержимого файла. Используется promises версия readFile.
     * Данные записываются в поле объекта.
     * Метод переопределяет одноименный метод базового класса
     */
    async #Read() {
        return super.Read();
    }
    /**
     * @method
     * Метод выполняет удаление всех типов комментариев из текстового буфера
     * и там же сохраняет результат.
     * Метод переопределяет одноименный метод базового класса
     */
    #Modify() {
        return super.Modify();
    }
    /**
     * @method
     * Метод записывает обработанные данные в новый файл, имя создаваемого файла отличается
     * дополнительным шаблоном. Используется promises версия writeFile.
     * Исходный файл не модифицируется.
     * Метод переопределяет одноименный метод базового класса
     */
    async #Write() {
        return super.Write();
    }
    /**
     * @method
     * Метод выполняет прикладную циклограмму ЧТЕНИЕ-МОДИФИКАЦИЯ-ЗАПИСЬ
     * @returns {boolean} - true в случае успеха, false в случае неудачи
     */
    async RMWfile() {
        
        if(! await this.#Read() ) {//считать исходный код
            return false; //ошибка - выйти из программы
        }
        if(! this.#Modify() ) {//удалить комментарии
            return false; //ошибка - выйти из программы
        }
        if(! await this.#Write() ) {//сохранить результат в файл
            return false; //ошибка - выйти из программы
        }
        return 1; //программа отработала, все Ок!
        
        
    }
}

export { ClassRMWfile };