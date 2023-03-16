import { boxTypeDict, Value } from "./mp4BoxesDefine";
import type { BoxTypeDict } from "./mp4BoxesDefine"

type PairItem = {
    key: string;
    value: (string | number | PairItem[] | BoxItem)[] | string | number | PairItem[];
    binaryStartPoint: number;
    binaryLength: number;
}

type BoxItem = {
    type: string;
    binaryStartPoint: number;
    binaryLength: number;
    contents?: (PairItem | BoxItem)[];
}



function byte2Number(binary: Uint8Array, startPoint: number, length: number): number {
    let result = 0;
    for (let i = 0; i < length; i++) {
        result += binary[startPoint + i] << (8 * (length - 1 - i));
    }
    return result;
}

function byte2String(binary: Uint8Array, startPoint: number, length: number): string {
    const result = String.fromCharCode.apply(null, Array.from(binary.slice(startPoint, startPoint + length)));
    return result;
}

function byte2Binary(binary: Uint8Array, startPoint: number, length: number): string {
    const result = Array.from(binary.slice(startPoint, startPoint + length)).map((item) => item.toString(16).padStart(2, '0')).join('');
    return result;
}

function byte2Language(binary: Uint8Array, startPoint: number, length: number): string {
    const result = Array.from(binary.slice(startPoint, startPoint + length)).map((item) => String.fromCharCode(item + 0x60)).join('');
    return result;
}

function byte2FixedPoint(binary: Uint8Array, startPoint: number, length: number): number {
    // asume point is on the half
    const result = byte2Number(binary, startPoint, length);
    const point = 1 << (4 * length);
    return result / point;
}

function getValue(_type: 'number' | 'string' | 'binary' | 'language' | 'fixedPoint', binary: Uint8Array, mask?: number): string | number {
    let value = null;
    if (_type === 'number') {
        value = byte2Number(binary, 0, binary.length);
    } else if (_type === 'string') {
        value = byte2String(binary, 0, binary.length);
    } else if (_type === 'binary') {
        value = byte2Binary(binary, 0, binary.length);
    } else if (_type === 'language') {
        value = byte2Language(binary, 0, binary.length);
    } else if (_type === 'fixedPoint') {
        value = byte2FixedPoint(binary, 0, binary.length);
    } else {
        throw new Error(`type not support: ${_type}`); // unreachable
    }
    if (mask) {
        if (typeof value !== 'number') {
            throw new Error(`mask only support number type`);
        }
        value = value & mask;
    }
    return value;
}

function structParser(binary: Uint8Array, startPoint: number, length: number | null, parentPairs: PairItem[], struct: Value[]): {
    pairs: PairItem[],
    binaryLength: number
} {
    const currentPairs: PairItem[] = [];
    let offset = 0;
    for (const structValue of struct) {
        const key = structValue.name;
        const binaryStartPoint = startPoint + offset;
        const _valueType = structValue._type;
        // container
        if (_valueType === 'container') {
            if (length === null) {
                throw new Error(`container length is null at ${startPoint}`);
            }
            const {boxes, binaryLength} = containerParser(binary, binaryStartPoint, length - offset, structValue.typeDict);
            currentPairs.push({
                key: key,
                value: boxes,
                binaryStartPoint: binaryStartPoint,
                binaryLength: binaryLength
            });
            offset += binaryLength;
            continue;
        }
        let loopCount = 1;
        // loop
        if (structValue.loop) {
            if (structValue.loop === 'inf') {
                loopCount = Infinity;
            } else {
                const loopKey = currentPairs.find((item) => item.key === structValue.loop);
                if (!loopKey) {
                    throw new Error(`loop key not found: ${structValue.loop} at ${startPoint}`);
                } 
                if (typeof loopKey.value !== 'number') {
                    throw new Error(`loop key is not number: ${structValue.loop} at ${startPoint}`);
                }
                loopCount = loopKey.value;
            }
        }
        const valueList = [];
        if (loopCount === Infinity && length === null) {
            throw new Error(`length should not be null when loop in inf at ${startPoint}`);
        }
        let loopOffset = 0;
        while (loopCount-- && (!length || offset + loopOffset < length)) {
            const binaryStartPointInLoop = binaryStartPoint + loopOffset;
            let valueLength = 0;
            if (_valueType === 'struct') {
                const {pairs, binaryLength} = structParser(binary, binaryStartPointInLoop, null, currentPairs, structValue.struct);
                valueList.push(pairs);
                valueLength = binaryLength;
            } else {
                // size
                if (structValue.size === 'auto') {
                    if (length === null) {
                        throw new Error(`size is auto but length is null at ${binaryStartPointInLoop}`);
                    }
                    valueLength = length - binaryStartPointInLoop;
                } else if (typeof structValue.size === 'string') {
                    const sizeKey = currentPairs.find((item) => item.key === structValue.size);
                    if (!sizeKey) {
                        throw new Error(`size key not found: ${structValue.size} at ${binaryStartPointInLoop}`);
                    } 
                    if (typeof sizeKey.value !== 'number') {
                        throw new Error(`size key is not number: ${structValue.size} at ${binaryStartPointInLoop}`);
                    }
                    valueLength = sizeKey.value;
                } else {
                    valueLength = structValue.size;
                }
                if (structValue.exSize) {
                    let versionKey = currentPairs.find((item) => item.key === 'version');
                    if (!versionKey) {
                        versionKey = parentPairs.find((item) => item.key === 'version');
                    }
                    if (!versionKey || typeof versionKey.value !== 'number') {
                        throw new Error(`version key ${versionKey} not found at ${binaryStartPointInLoop}}`);
                    }
                    if (versionKey.value === 1) {
                        valueLength = structValue.exSize;
                    }
                }
                const valueBinary = binary.slice(binaryStartPointInLoop, binaryStartPointInLoop + valueLength);
                const value = getValue(_valueType, valueBinary, structValue.mask);
                valueList.push(value);
            }
            loopOffset += valueLength;
        }
        offset += loopOffset;
        if (valueList.length === 1) {
            currentPairs.push({
                key: key,
                value: valueList[0],
                binaryStartPoint: binaryStartPoint,
                binaryLength: startPoint + offset - binaryStartPoint
            });
        } else {
            currentPairs.push({
                key: key,
                value: valueList,
                binaryStartPoint: binaryStartPoint,
                binaryLength: startPoint + offset - binaryStartPoint
            });
        }
    }
    return {
        pairs: currentPairs,
        binaryLength: offset
    };
}

function boxParser(binary: Uint8Array, startPoint: number, boxTypeDict: BoxTypeDict): {
    box: BoxItem,
    binaryLength: number
} {
    let length = byte2Number(binary, startPoint, 4);
    const boxType = byte2String(binary, startPoint + 4, 4);
    let offset = 8;
    if (length === 0) {
        return {
            box: {
                type: '_end',
                binaryStartPoint: startPoint,
                binaryLength: 4
            },
            binaryLength: 4
        }
    }
    if (length === 1) {
        length = byte2Number(binary, startPoint + 8, 8);
        offset = 20;
    } else {
        offset = 8;
    }

    if (!boxTypeDict[boxType]) {
        console.error(`unknown box type: ${boxType} at ${startPoint}`);
        return {
            box: {
                type: boxType,
                binaryStartPoint: startPoint,
                binaryLength: length
            },
            binaryLength: length
        }
    }
    const boxDesp = boxTypeDict[boxType];
    const _boxType = boxDesp._type;
    if (_boxType === 'container') {
        const {boxes, binaryLength} = containerParser(binary, startPoint + offset, length - offset, boxDesp.typeDict);
        return {
            box: {
                type: boxType,
                binaryStartPoint: startPoint,
                binaryLength: length,
                contents: boxes
            },
            binaryLength: length
        }
    } else if (_boxType === 'struct') {
        const {pairs, binaryLength} = structParser(binary, startPoint + offset, length - offset, [], boxDesp.struct);
        return {
            box: {
                type: boxType,
                binaryStartPoint: startPoint,
                binaryLength: length,
                contents: pairs
            },
            binaryLength: length
        }
    } else {
        throw new Error(`unknown box type: ${boxType}`); // unreachable
    }
}

function containerParser(binary: Uint8Array, startPoint: number, length: number, boxTypeDict: BoxTypeDict): {
    boxes: BoxItem[],
    binaryLength: number
} {
    const result: BoxItem[] = [];
    let offset = 0;
    while (offset < length) {
        const {box, binaryLength} = boxParser(binary, startPoint + offset, boxTypeDict);
        result.push(box);
        offset += binaryLength;
    }
    return {
        boxes: result,
        binaryLength: offset
    }
}

export default function mp4Parser(binary: Uint8Array): BoxItem[] {
    const {boxes, binaryLength} =  containerParser(binary, 0, binary.length, boxTypeDict);
    if (binaryLength !== binary.length) {
        throw new Error(`binary length not match: ${binaryLength} !== ${binary.length}`);
    }
    return boxes;
}