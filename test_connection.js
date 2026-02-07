const http = require('http');

console.log('Testing connection to server...');

const req = http.request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/',
    method: 'GET'
}, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`PROBLEM: ${e.message}`);
    console.log('SUGGESTION: The server might not be running or crashed. Please check the server terminal.');
});

req.end();
