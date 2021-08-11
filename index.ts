import BloomFilter from './BloomFilter';

import wordlist from './wordlist';

const bf = new BloomFilter(wordlist.length, 0.1);

wordlist.forEach(w => {
    bf.set(w)
    console.log('Error Rate', bf.errorRate());
}
);

console.log('set', 'asd', bf.set('asd'));
console.log('get', 'asd', bf.get('asd'));
console.log('get', 'asdd', bf.get('11'));

bf.stats();