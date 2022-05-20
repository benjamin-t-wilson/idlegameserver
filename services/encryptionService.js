const CryptoJS = require("crypto-js");

const encodeString = (text) => {
  return CryptoJS.AES.encrypt(text, process.env.CIPHER).toString();
};

const decodeString = (encrypted) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, process.env.CIPHER);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encodeString, decodeString };
