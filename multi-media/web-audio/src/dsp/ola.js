function genHannWindow(size) {
    const window = new Float32Array(size);
    for (let i = 0; i < size; i++) {
        window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (size - 1)));
    }
    return window;
}

export function baseOLA(inputBuff, audioContext, rate=1, sliceLength=0.05, prefix=0.25) {
    console.log("baseOLA");
    const outputLength = Math.floor(inputBuff.length / rate);
    const outputBuff = audioContext.createBuffer(
        inputBuff.numberOfChannels,
        outputLength,
        inputBuff.sampleRate,
    )
    const sliceSize = sliceLength * inputBuff.sampleRate;
    const offsetSize = Math.floor(sliceSize * prefix / rate);
    for (let channel=0; channel<inputBuff.numberOfChannels; channel++) {
        for (let start=0; start<outputLength; start+=offsetSize) {
            const end = Math.min(start + sliceSize, outputLength);
            const inputStart = Math.floor(start * rate);
            for (let i = 0; i < end-start; i++) {
                outputBuff.getChannelData(channel)[start+i] += inputBuff.getChannelData(channel)[inputStart+i];
            }
        }
    }
    return outputBuff;
}

export function wOLA(inputBuff, audioContext, rate=1, sliceLength=0.05, prefix=0.25) {
    console.log("wOLA");
    const outputLength = Math.floor(inputBuff.length / rate);
    const outputBuff = audioContext.createBuffer(
        inputBuff.numberOfChannels,
        outputLength,
        inputBuff.sampleRate,
    )
    const sliceSize = sliceLength * inputBuff.sampleRate;
    const offsetSize = Math.floor(sliceSize * prefix / rate);

    const hannWindow = genHannWindow(sliceSize);
    for (let channel=0; channel<inputBuff.numberOfChannels; channel++) {
        for (let start=0; start<outputLength; start+=offsetSize) {
            const end = Math.min(start + sliceSize, outputLength);
            const inputStart = Math.floor(start * rate);
            for (let i = 0; i < end-start; i++) {
                outputBuff.getChannelData(channel)[start+i] += inputBuff.getChannelData(channel)[inputStart+i] * hannWindow[i];
            }
        }
    }
    return outputBuff;
}
