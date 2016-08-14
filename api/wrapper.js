var __ = require('underscore')
var crypto = require('crypto')

var dict = [];

const domain = 'http://disposal.us-east-1.elasticbeanstalk.com'

exports.wrap = function(req, res)
{
    if (!req.query.m)
    {
        return res.status(400).send(JSON.stringify({'error':'Missing parameter m'}));
    }
    
    var message = req.query.m;
    
    // sould the message with some random data
    var saulted = message + Math.random() + Date.now();
    
    // hash it to get a unique link
    var hashLink = crypto.createHmac('sha256', saulted )
                   .update(saulted)
                   .digest('hex');
    
    // push to RAM dictionary
    dict.push({
        'key':hashLink,
        'value': message
    });
    
    // Return the link
    res.send(JSON.stringify({
        'url': domain + '/view?k='+hashLink
    }));
}

exports.unwrap = function(req, res)
{
    if (!req.query.k)
    {
        return res.status(400).send(JSON.stringify({'error':'Missing parameter k'}));
    }
    
    // Find the message
    var index = __.findIndex(dict, function(x)
    {
        return x.key == req.query.k
    });
    
    if(index == -1)
    {
        return  res.status(404).send(JSON.stringify({'error':'Message not found or disposed'}));
    }
    
    // Extract the messate
    var message = dict[index].value;
    
    // Remvoe from dict
    dict.splice(index,1);
    
    res.send(JSON.stringify({'message':message}));
}