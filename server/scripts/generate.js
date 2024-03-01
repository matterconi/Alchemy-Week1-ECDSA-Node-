const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex } = require("ethereum-cryptography/utils.js");
const { keccak256 } = require("ethereum-cryptography/keccak.js");

const _getPrivateKey = () => {
    return secp256k1.utils.randomPrivateKey();
}

const _getPublicKey = (privateKey) => {
    return secp256k1.getPublicKey(privateKey);
}


const _getAddress = (publicKey) => {
    return toHex(keccak256(publicKey.slice(1)).slice(-20));
}

const formatValue = (value) => {
    return toHex(value);
}
module.exports = { _getPrivateKey, _getPublicKey, _getAddress, formatValue }