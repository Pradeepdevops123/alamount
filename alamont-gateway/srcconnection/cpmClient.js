const https = require('https');

function createConnection(postData, callback) {
    var options = {
        hostname: process.env.cpmHostName,
        path: '/sdn/cpm/gateways/connection-created',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var req = https.request(options, (res) => {
        var data = "";
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {

            console.log('Server response code ' + res.statusCode);
            callback();
        });
    });
    console.log(JSON.stringify(postData));

    req.on('error', (e) => {
        console.error(e);
        callback(e);
    });
    req.write(JSON.stringify(postData));
    req.end();

}

exports.createConnection = createConnection;
