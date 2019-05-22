Code is borrowed from https://www.npmjs.com/package/soap
Soap node module's WSSecurity is broken in node.js v6 and above
so you can use this module for implemeting WSSecurity in soap node module.
Incase of node.js v5 and below inbuilt WSSecurity implementation is working fine.

How to use it
```javascript
 var WSSecurity = require('wssecurity-soap');
 var soap = require('soap');
 var url = "https://some/wsdl";
 var user = "";
 var pass = "";
 var options = { };
 soap.createClient(url, options, function(err, client) {
    client.setSecurity(new WSSecurity(user, pass, 'PasswordDigest'))
    // your logic here 
 });