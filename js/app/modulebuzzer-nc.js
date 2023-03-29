
class ClassBuzzerTypePlay {
    constructor(_pulseDur, _numRep, _freq, _prop) {
        this.name = 'ClassBuzzerTypePlay'; 
        this._PulseDur = undefined;
        this._NumRep = undefined;
        this._Freq = undefined;
        this._Proportions = undefined;
        this.Init(_pulseDur, _numRep, _freq, _prop); 
    }
    static get ERROR_CODE_ARG_VALUE() { return 10; }
    static get ERROR_MSG_ARG_VALUE() { return `ERROR>> invalid data. ClassID: ${this.name}`; }
    Init(_pulseDur, _numRep, _freq, _prop) {
        let pulsedur = _pulseDur || 100;
        let numrep = _numRep || 1;
        let freq = _freq || 4000;
        let prop = _prop || 0.5;
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
        if (pulsedur<50) {pulsedur=50;} 
        if (prop<0 || prop>1) {prop=0.5;}
        this._PulseDur = pulsedur;
        this._NumRep = numrep;
        this._Freq = freq;
        this._Proportions = prop;
    }
}
class ClassBuzzer {
    constructor(_opt) {
        this.name = 'ClassBuzzer'; 
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
    static get ERROR_CODE_ARG_VALUE() { return 10; }
    static get ERROR_MSG_ARG_VALUE() { return `ERROR>> invalid data. ClassID: ${this.name}`; }
    PlayBeep(_opt) {
        if(!(_opt instanceof ClassBuzzerTypePlay)) {
            throw new ClassAppError(ClassBuzzer.ERROR_MSG_ARG_VALUE,
                                    ClassBuzzer.ERROR_CODE_ARG_VALUE);
        }        
        let Thi = _opt._PulseDur; 
        let Tlo = Math.floor(_opt._PulseDur*(1-_opt._Proportions)/_opt._Proportions); 
        let beep_count = _opt._NumRep*2; 
        let beep_flag = true;
        analogWrite(this._BuzPin, 0.5, { freq : _opt._Freq }); 
        let beep_func = ()=>{
            --beep_count;
            if (beep_count > 0) {
                if (beep_flag) {
                    digitalWrite(this._BuzPin, beep_flag); 
                        setTimeout(beep_func, Tlo); 
                } else {
                    analogWrite(this._BuzPin, 0.5, {freq: _opt._Freq}); 
                        setTimeout(beep_func, Thi); 
                }
                beep_flag = !beep_flag;
            }
        }
        setTimeout(beep_func, Thi);
    }
}
exports = { ClassBuzzerTypePlay:    ClassBuzzerTypePlay,
            ClassBuzzer:            ClassBuzzer};
