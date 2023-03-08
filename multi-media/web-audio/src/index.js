import { baseOLA, wOLA } from "./dsp/ola.js";

export class AudioContextWrapper {
    constructor() {
        this.audioContext = new AudioContext();
        this.decodedBuf = null;
        this.source = null;
        this.method = "baseOLA";
        this.eventCenter = {
            playBackState: [],
            rate: []
        };
        const handler = {
            set: (target, p, newValue) => {
                target[p] = newValue;
                this.eventCenter[p].forEach(fn => fn(newValue));
                return true;
            }
        }
        this.state = new Proxy({
            playBackState: "unload",
            rate: 1
        }, handler);
    }

    _connect(buf) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buf;
        source.connect(this.audioContext.destination);
        this.source = source;
        return source;
    }

    _decode(buf) {
        return new Promise((resolve, reject) => {
            this.audioContext.decodeAudioData(buf, buffer => {
                if (buffer) {
                    resolve(buffer);
                } else {
                    reject("decode error");
                }
            })
        })
    }

    _changeSpeed(buf, rate=1){
        const start = Date.now();
        if (rate === 1) return buf;
        let method = baseOLA;
        if (this.method == 'baseOLA') {
            method = baseOLA;
        } else if (this.method == 'wOLA') {
            method = wOLA;
        }
        const newBuf = method(buf, this.audioContext, rate);  
        const end = Date.now();
        console.log(`change speed cost ${end-start}ms`);      
        return newBuf;
    }

    async load(file) {
        if (this.source) {
            if (this.state.playBackState == 'playing') {
                this.source.stop();
            }
            this.source = null;
            this.decodedBuf = null;
        }
        const buf = await new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.addEventListener('load', () => {
                resolve(fileReader.result);
            });
            fileReader.readAsArrayBuffer(file);
        });
        const decodedBuf = await this._decode(buf);
        this.decodedBuf = decodedBuf;
        const processedBuf = this._changeSpeed(decodedBuf, this.state.rate);
        this._connect(processedBuf);
        this.state.playBackState = "stop"
    }

    play() {
        this.state.playBackState = 'playing';
        this.source.start()
    }

    stop() {
        this.state.playBackState = 'stop';
        this.source.stop();
        const processedBuf = this._changeSpeed(this.decodedBuf, this.state.rate);
        this._connect(processedBuf);
    }

    slow() {
        this.state.rate -= 0.1;
        const processedBuf = this._changeSpeed(this.decodedBuf, this.state.rate);
        this._connect(processedBuf);   
    }

    fast() {
        this.state.rate += 0.1;
        const processedBuf = this._changeSpeed(this.decodedBuf, this.state.rate);
        this._connect(processedBuf);
    }

    setMethod(method) {
        this.method = method;
        const processedBuf = this._changeSpeed(this.decodedBuf, this.state.rate);
        this._connect(processedBuf);  
    }

    eventRegist(event, fn) {
        const eventTable = {
            playBackStateChange: "playBackState",
            rateChange: "rate"
        }
        this.eventCenter[eventTable[event]].push(fn);
    }
}

