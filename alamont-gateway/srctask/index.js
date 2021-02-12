var AWS = require('aws-sdk');
const cpmClient = require('cpmClient.js');

AWS.config.update({ region: process.env.AWS_REGION });

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

exports.handler = (event, context, callback) => {
    
    console.log('Received event:', JSON.stringify(event, null, 2));
    for (const record of event.Records) {
     
        if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
            console.log(record.dynamodb.NewImage);
            var params = {
                TableName: 'connections',
                Key: {
                    'id': { S: record.dynamodb.NewImage.divisionId.S }
                }
            };

            // Call DynamoDB to read the item from the table
            ddb.getItem(params, function (err, data) {
                if (err) {
                    console.log("Error", err);
                } else {
                    console.log("Success", data.Item);

                    cpmClient.callCheckpoint({
                        'clientId': process.env.cpmClientId,
                        'clientSecret': process.env.cpmClientSecret,
                        'action': record.dynamodb.NewImage.done.BOOL ? 'done' : 'undo',
                        'connectionId': data.Item.cpmConnectionId.S,
                        'checkpointName': 'Bookkeeping.' + record.dynamodb.NewImage.taskType.S,
                        'instances': [{
                            'target': 'recurring',
                            'date': record.dynamodb.NewImage.year.S + '-' + getMonthFromString(record.dynamodb.NewImage.month.S) + '-01',
                        }]

                    }, callback);
                }
            });
        }
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb.NewImage);
    }
};

function getMonthFromString(mon) {
    var d = Date.parse(mon + "1, 2012");
    if (!isNaN(d)) {
        var monthNo = new Date(d).getMonth() + 1;
        return (monthNo < 10) ? '0' + monthNo : monthNo;
    }
    return -1;
}