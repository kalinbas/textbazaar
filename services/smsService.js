var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function sendSms(number, message, callback) {

    // just send a real sms when its not on local server
    if (!process.env.NODE_ENV) {
        console.log("SMS to " + number + ": " + message);
        callback();
    } else {
        client.sendMessage({
            to: number,
            from: '+15105674463',
            body: message
        }, function (err, responseData) {
            if (err) {
                console.log(err);
            }
            callback();
        });
    }
}

module.exports = {
    sendSms: sendSms
};