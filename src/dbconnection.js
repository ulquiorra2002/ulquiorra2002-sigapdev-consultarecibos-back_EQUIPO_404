let promise = require('bluebird');
let options = {
    promiseLib: promise
};

let pgp = require('pg-promise')(options);

const  urlconnection = 'postgres://modulo4:modulo4@161.35.60.197:5432/tcs7';

let cn = pgp(urlconnection);

module.exports = {
    connection: cn
};
