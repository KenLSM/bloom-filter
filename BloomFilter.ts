import XXD from 'xxhashjs'

function hashK(msg: string, hashRuns: number, arraySize: number) {
    // https://citeseer.ist.psu.edu/viewdoc/download?doi=10.1.1.152.579&rep=rep1&type=pdf
    // crazy optimization to reduce number of hashing operations
    // basically hashKth = hash1 + K*hash2
    const hashResult = [];
    const hash1 = XXD.h32(msg, String(12311)).toNumber();
    const hash2 = XXD.h32(msg, String(112)).toNumber();
    for (let i = 0; i < hashRuns; i++) {
        const hashVal = (hash1 + hash2 * i) % arraySize;
        hashResult.push(Math.abs(hashVal));
    }
    console.log({ msg, hashResult });
    return hashResult;
}

// https://en.wikipedia.org/wiki/Bloom_filter#Optimal_number_of_hash_functions
function getBitsNeeded(size: number, errorRate: number) {
    const bitsNeeds = Math.ceil(-(size * Math.log(errorRate)) / Math.pow(Math.LN2, 2));
    return bitsNeeds;
}

function getHashesNeeded(arraySize: number, errorRate: number) {
    const hashesNeeded = Math.ceil((arraySize / errorRate) * Math.LN2);
    return hashesNeeded;
}

class BloomFilter {
    _array: Array<boolean>;
    _hashesNeeded: number;
    _arraySize: number;
    _elementCount: number;
    _length: number;
    constructor(elementCount: number, errorRate: number) {
        this._arraySize = getBitsNeeded(elementCount, errorRate);
        this._array = new Array(this._arraySize);
        this._length = 0;
        this._hashesNeeded = getHashesNeeded(this._arraySize, elementCount);


    }

    stats() {
        console.log({
            arraySize: this._arraySize,
            hashesNeeded: this._hashesNeeded,
            elementsInserted: this._length,
            errorRate: this.errorRate()
        })
    }
    set(msg: string) {
        const indices = hashK(msg, this._hashesNeeded, this._arraySize);
        for (let i = 0; i < this._hashesNeeded; i++) {
            this._array[indices[i]] = true;
        }
        this._length++;
    }

    get(msg: string): boolean {
        const indices = hashK(msg, this._hashesNeeded, this._arraySize);
        for (let i = 0; i < this._hashesNeeded; i++) {
            if (this._array[indices[i]] !== true) {
                return false;
            }
        }
        return true;
    }

    // https://en.wikipedia.org/wiki/Bloom_filter#:~:text=the%20probability%20of%20all%20of%20them%20being%201%2C%20which%20would%20cause%20the%20algorithm%20to%20erroneously%20claim%20that%20the%20element%20is%20in%20the%20set%2C%20is%20often%20given%20as
    /**
     * epsilon: error rate
     * k = number of hashes assigned
     * n = number of elements added
     * m = array length of bloom filter
     * @returns error rate
     */
    errorRate(): number {
        return Math.pow(1 - Math.exp(-this._hashesNeeded * this._length / this._arraySize), this._hashesNeeded)
    }
}

export default BloomFilter