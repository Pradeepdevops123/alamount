const cpmClient = require('./cpmClient');

exports.handler = (event, context , callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    for (const record of event.Records) {
        if(record.eventName === 'INSERT'){
            console.log('Inside Insert');
            console.log(record.dynamodb.NewImage);
            cpmClient.createConnection({
                'clientId': process.env.cpmClientId,
                'clientSecret': process.env.cpmClientSecret,
                'connectionId': record.dynamodb.NewImage.cpmConnectionId.S,
                'externalClientName': record.dynamodb.NewImage.cpmClientName.S,
                'nonce' : record.dynamodb.NewImage.nonce.S
            } ,callback);
        }
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb.NewImage);
    }
    
};