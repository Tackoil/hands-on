export class AudioContextWrapper {
    constructor() {
        this.audioContext = new AudioContext();
        this.decodedBuf = null;
        this.source = null;
        this.state = 'stop';
    }

    _connect(buf) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buf;
        source.connect(this.audioContext.destination);
        this.decodedBuf = buf;
        this.source = source;
        return source;
    }

    _decode(buf) {
        return new Promise((resolve, reject) => {
            this.audioContext.decodeAudioData(buf, buffer => {
                if (buffer) {
                    const source = this._connect(buffer);
                    resolve(source);
                } else {
                    reject("decode error");
                }
            })
        })
    }

    async load(file) {
        if (this.source) {
            if (this.state !== 'stop') {
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
        return await this._decode(buf);
    }

    play() {
        this.state = 'play';
        this.source.start()
    }

    stop() {
        this.state = 'stop';
        this.source.stop();
        this._connect(this.decodedBuf);
    }
}

