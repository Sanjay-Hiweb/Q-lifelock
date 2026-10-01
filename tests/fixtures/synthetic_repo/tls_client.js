/**
 * Node.js TLS Key Agreement Helper
 */
const crypto = require('crypto');

// data_class: "api_session_tokens"
// lifetime_years: 0

function establishSessionECDH() {
    const serverEcdh = crypto.createECDH('prime256v1');
    serverEcdh.generateKeys();
    return serverEcdh;
}

module.exports = { establishSessionECDH };
