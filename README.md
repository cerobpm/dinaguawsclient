# dinaguawsclient

###RESTfull proxy for Dinaguaws SOAP web service

####Requires:

nodejs

####Configuration:

In file config/default.json, set user and password for Dinaguaws.

####Run:

$nodejs index.js

-- you will see

setting security

server listening on port 4000

-- on the server log

####Use:
Then access the User Interface via web browser at 

http://localhost:4000/

or point directly to the endpoint via command line application or any http client interface, for example:

curl "http://localhost:4000/getEstaciones"

curl "http://localhost:4000/getEstaciones2"

curl "http://localhost:4000/getLecturasEstacionFecha?args0=0000001330&args1=20190527"
