/**
 * @class
 * Класс ClassBuzzerTypePlay обеспечивает прикладной тип для методов класса ClassBuzzer.
 * Пример набора аргументов конструктора:
 * {4 /импульса/, 200 /ms длительность/, 0.5 /50% скважность/}
 */
class ClassBuzzerTypePlay {
    /**
     * @constructor
     * @param {number} _pulseDur    - длительность звучания в ms [50<=x<infinity]
     * @param {number} _numRep      - количество повторений [1...n]
     * @param {number} _freq        - рабочая частота buzzer
     * @param {number} _prop        - пропорция ЗВУК/ТИШИНА на одном периоде [0<x<=1]
     */
    constructor(_pulseDur, _numRep, _freq, _prop) {
        this.name = 'ClassBuzzerTypePlay'; //переопределяем имя типа


        this._PulseDur = undefined;
        this._NumRep = undefined;
        this._Freq = undefined;
        this._Proportions = undefined;
        
        this.Init(_pulseDur, _numRep, _freq, _prop); //инициализировать поля
        
    }
    /*******************************************CONST********************************************/
    /**
     * @const
     * @type {number}
     * Константа ERROR_CODE_ARG_VALUE определяет код ошибки, которая может произойти
     * в случае передачи в конструктор не валидных данных
     */
    static get ERROR_CODE_ARG_VALUE() { return 10; }
    /**
     * @const
     * @type {string}
     * Константа ERROR_MSG_ARG_VALUE определяет сообщение ошибки, которая может произойти
     * в случае передачи в конструктор не валидных данных
     */
    static get ERROR_MSG_ARG_VALUE() { return `ERROR>> invalid data. ClassID: ${this.name}`; }
    /*******************************************END CONST****************************************/
    /**
     * Метод инициализирует поля объекта
     */
    Init(_pulseDur, _numRep, _freq, _prop) {
        let pulsedur = _pulseDur || 100;
        let numrep = _numRep || 1;
        let freq = _freq || 4000;
        let prop = _prop || 0.5;
        
        
        
        /*проверить переданные аргументы  на валидность*/
        if (!(typeof (pulsedur) === 'number')   ||
            !(typeof (numrep) === 'number')     ||
            !(typeof (freq) === 'number')       ||
            !(typeof (prop) === 'number')       ||
            !(Number.isInteger(pulsedur))       ||
            !(Number.isInteger(numrep))         ||
            !(Number.isInteger(freq))) {
                
                throw new err(ClassTypeBuzzerPlay.ERROR_MSG_ARG_VALUE,
                              ClassTypeBuzzerPlay.ERROR_CODE_ARG_VALUE);
        }
        if (pulsedur<50) {pulsedur=50;} //нормализовать значение длительности импульса звучания
        if (prop<0 || prop>1) {prop=0.5;}
        
        /*инициализировать поля*/
        this._PulseDur = pulsedur;
        this._NumRep = numrep;
        this._Freq = freq;
        this._Proportions = prop;
    }
}

/**
 * @class
 * Класс ClassBuzzer реализует логику работы пьезодатчика.
 * Для работы класса требуется подключить модуль ModuleAppMath, где 
 * добавляется функция проверки на целочисленность
 */
class ClassBuzzer {
    /**
     * @constructor
     * @param {Object} _opt   - объект класса Pin
     */
    constructor(_opt) {
        this.name = 'ClassBuzzer'; //переопределяем имя типа

        /*проверить переданные аргументы на валидность*/
        if ((typeof (_opt) === 'undefined')) {
            
            throw new err(ClassTypeBuzzer.ERROR_MSG_ARG_VALUE ,
                          ClassTypeBuzzer.ERROR_CODE_ARG_VALUE);
        }
        if(!(_opt instanceof Pin)) {
            
            throw new err(ClassTypeBuzzer.ERROR_MSG_ARG_VALUE,
                          ClassTypeBuzzer.ERROR_CODE_ARG_VALUE);
        }
        this._BuzPin = _opt; 
    }
    /*******************************************CONST********************************************/
    /**
     * @const
     * @type {number}
     * Константа ERROR_CODE_ARG_VALUE определяет код ошибки, которая может произойти
     * в случае передачи не валидных данных
     */
    static get ERROR_CODE_ARG_VALUE() { return 10; }
    /**
     * @const
     * @type {string}
     * Константа ERROR_MSG_ARG_VALUE определяет сообщение ошибки, которая может произойти
     * в случае передачи не валидных данных
     */
    static get ERROR_MSG_ARG_VALUE() { return `ERROR>> invalid data. ClassID: ${this.name}`; }
    /*******************************************END CONST****************************************/
    /**
     * @method
     * 
     * @param {Object} _opt   - объект класса ClassTypeBuzzerPlay
     */
    PlayBeep(_opt) {
        /*проверить переданные аргументы на валидность*/
        if(!(_opt instanceof ClassBuzzerTypePlay)) {
            throw new ClassAppError(ClassBuzzer.ERROR_MSG_ARG_VALUE,
                                    ClassBuzzer.ERROR_CODE_ARG_VALUE);
        }        
        /*-сформировать двойной звуковой сигнал */
        let Thi = _opt._PulseDur; //длительность звукового сигнала
        let Tlo = Math.floor(_opt._PulseDur*(1-_opt._Proportions)/_opt._Proportions); //длительность паузы
        let beep_count = _opt._NumRep*2; //количество полупериодов(!) звукового сигнала
        let beep_flag = true;
        analogWrite(this._BuzPin, 0.5, { freq : _opt._Freq }); //включить звуковой сигнал
        let beep_func = ()=>{
            --beep_count;
            if (beep_count > 0) {
                if (beep_flag) {
                    digitalWrite(this._BuzPin, beep_flag); //выключить звук
                        setTimeout(beep_func, Tlo); //взвести setTimeout
                } else {
                    analogWrite(this._BuzPin, 0.5, {freq: _opt._Freq}); //включить звук
                        setTimeout(beep_func, Thi); //взвести setTimeout
                }
                beep_flag = !beep_flag;
            }
        }
        setTimeout(beep_func, Thi);
    }
}
exports = { ClassBuzzerTypePlay:    ClassBuzzerTypePlay,
            ClassBuzzer:            ClassBuzzer};
