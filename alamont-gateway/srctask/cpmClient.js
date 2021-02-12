const https = require('https');


function callCheckpoint(postData, callback) {
    var options = {
        hostname: process.env.cpmHostName,
        path: '/sdn/cpm/gateways/checkpoint',
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

exports.callCheckpoint = callCheckpoint;
