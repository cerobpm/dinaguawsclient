// index.js
'use strict'

const soap = require('soap')
const WSSecurity= require('wssecurity-soap')
const express = require('express')
const app = express()
const fs = require('fs')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Table = require('table-builder')
const request = require('request')
const xml = require('xml')
const { Client } = require('pg')
//~ const dbclient = new Client({database: 'odm', user: 'wmlclient', password: 'wmlclient'})

//~ dbclient.connect((err) => {
//~ if (err) {
    //~ console.error('connection error', err.stack)
  //~ } else {
    //~ console.log('connected')
    //~ dbclient.query('SELECT NOW() as now', (err, res) => {
	  //~ if(err) {
		  //~ console.log(err.stack)
	  //~ } else {
		  //~ console.log(res.rows[0])
	  //~ }
	//~ })
//~ }})
//~ const { body,validationResult } = require('express-validator/check');
//~ const { sanitizeBody } = require('express-validator/filter');
const port = 4000
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(express.static('public'));
var soapendpoint = 'https://app.mvotma.gub.uy/dinaguaws/dinaguaws?wsdl';
let soap_client_options = { 'request' : request.defaults({'proxy': 'http://jbianchi:jbianchi@10.10.10.119:3128', 'timeout': 20000, 'connection': 'keep-alive', "rejectUnauthorized": false, strictSSL: false})
	}						    //~ 'disableCache': true
const user = 'whos'
const password = 'g7mcT%5>T4'
soap.createClient(soapendpoint, soap_client_options, function(err, client) {
	if(err) {
		res.json({"message":"no se pudo crear conexión con el servidor",error:err})
		console.log(err)
		return
	}
	console.log("setting security")
	 var wsSecurity = new WSSecurity(user, password, {
		hasNonce: true,
		hasTokenCreated: true,
		passwordType: 'PasswordText',
		hasTimeStamp: true,
		mustUnderstand: true
	})
	client.setSecurity(wsSecurity)

	app.get('/dinaguawsclient', (req, res) => {
		res.render('dinaguawsclient')
		console.log('dinaguawsclient form displayed')
		return
	})
	app.get('/dinaguawsclient/getEstaciones', (req, res) => {
		//~ console.log(req.query)
		//~ if(req.query.Username && req.query.Password) {
			console.log(req.query)
			console.log("intentando request")
			client.getEstaciones({}, function(err, result, rawResponse) {
			  console.log(client.lastRequest)
			  if(err) {
				  res.status(500).json({message:"Dinaguaws server error",error:err})
				  console.log(err.stack)
				  return 
			  }
			  console.log("success!")
			  res.set('Content-Type', 'text/xml')
			  res.send(rawResponse)
			  return
			 })
	  //~ } else {
		  //~ res.render('getEstaciones',{Username: req.query.username, Password: req.query.password})
		  //~ console.log('getEstaciones form rendered')
		  //~ return
	  //~ }
	})

	app.get('/dinaguawsclient/getEstaciones2', (req, res) => {
		//~ console.log(req.query)
		//~ if(req.query.Username && req.query.Password) {
			console.log(req.query)
			console.log("intentando request")
			client.getEstaciones2({}, function(err, result, rawResponse) {
			  console.log(client.lastRequest)
			  if(err) {
				  res.status(500).json({message:"Dinaguaws server error",error:err})
				  console.log(err.stack)
				  return 
			  }
			  console.log("success!")
			  res.set('Content-Type', 'text/xml')
			  res.send(rawResponse)
			  return
		  })
	  //~ } else {
		  //~ res.render('getEstaciones2',{Username: req.query.username, Password: req.query.password})
		  //~ console.log('getEstaciones2 form rendered')
		  //~ return
	  //~ }
	})

	app.get('/dinaguawsclient/getLast', (req, res) => {
		//~ console.log(req.query)
		//~ if(req.query.Username && req.query.Password) {
			console.log(req.query)
			console.log("intentando request")
			client.getLast({}, function(err, result, rawResponse) {
			  console.log(client.lastRequest)
			  if(err) {
				  res.status(500).json({message:"Dinaguaws server error",error:err})
				  console.log(err.stack)
				  return 
			  }
			  console.log("success!")
			  res.set('Content-Type', 'text/xml')
			  res.send(rawResponse)
			  return
		  })
	  //~ } else {
		  //~ res.render('getLast',{Username: req.query.username, Password: req.query.password})
		  //~ console.log('getLast form rendered')
		  //~ return
	  //~ }
	})

	app.get('/dinaguawsclient/getLast2', (req, res) => {
		//~ console.log(req.query)
		//~ if(req.query.Username && req.query.Password) {
			console.log(req.query)
			console.log("intentando request")
			client.getLast2({}, function(err, result, rawResponse) {
			  console.log(client.lastRequest)
			  if(err) {
				  res.status(500).json({message:"Dinaguaws server error",error:err})
				  console.log(err.stack)
				  return 
			  }
			  console.log("success!")
			  res.set('Content-Type', 'text/xml')
			  res.send(rawResponse)
			  return
		  })
	  //~ } else {
		  //~ res.render('getLast2',{Username: req.query.username, Password: req.query.password})
		  //~ console.log('getLast form rendered')
		  //~ return
	  //~ }
	})


	app.listen(port, (err) => {
		if (err) {
			return console.log('rrr',err)
		}
		console.log(`server listening on port ${port}`)
	})
})
