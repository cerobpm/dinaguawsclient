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
const config = require('config')
var format = require('xml-formatter');
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
var soapendpoint = config.get('soapClient.login.Endpoint')  // 'https://app.mvotma.gub.uy/dinaguaws/dinaguaws?wsdl';
var soap_client_options = {}
if(config.has('soapClient.options')) {
	soap_client_options = { 'request' : request.defaults(config.get('soapClient.options'))}  // request.defaults({'proxy': 'http://jbianchi:jbianchi@10.10.10.119:3128', 'timeout': 20000, 'connection': 'keep-alive', "rejectUnauthorized": false, strictSSL: false})
							    //~ 'disableCache': true
}
//~ console.log(soap_client_options)
const user = config.get('soapClient.login.Username')  // 'whos'
const password = config.get('soapClient.login.Password')  // g7mcT%5>T4'
soap.createClient(soapendpoint, soap_client_options, function(err, client) {
	if(err) {
		//~ res.json({"message":"no se pudo crear conexión con el servidor",error:err})
		console.log(err)
		return
	}
	console.log("setting security")
	 var wsSecurity = new WSSecurity(user, password, {
		hasNonce: false,
		hasTokenCreated: false,
		passwordType: 'PasswordText',
		hasTimeStamp: false,
		mustUnderstand: true
	})
	client.setSecurity(wsSecurity)

	app.get('/', (req, res) => {
		res.render('dinaguawsclient')
		console.log('dinaguawsclient form displayed')
		return
	})
	app.get('/getEstaciones', (req, res) => {
		//~ console.log(req.query)
		//~ if(req.query.Username && req.query.Password) {
			//~ console.log("intentando request")
			//~ console.log(client.getSoapHeaders())
			client.getEstaciones({}, function(err, result, rawResponse) {
			  //~ console.log(format(client.lastRequest))
			  if(err) {
				  res.status(500).send(err)
				  //~ console.log(err.stack)
				  console.log("getEstaciones:Failed. " + Date.now())
				  return 
			  }
			  //~ console.log("success!")
			  console.log("getEstaciones:Succeded. " + Date.now())
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

	app.get('/getEstaciones2', (req, res) => {
		//~ console.log(req.query)
		//~ if(req.query.Username && req.query.Password) {
			//~ console.log("intentando request")
			client.getEstaciones2({}, function(err, result, rawResponse) {
			  //~ console.log(format(client.lastRequest))
			  if(err) {
				  res.status(500).send(err)
				  //~ console.log(err.stack)
				  console.log("getEstaciones2:Failed. " + Date.now())
				  return 
			  }
			  console.log("getEstaciones2:Succeded. " + Date.now())
			  var csv = estaciones22csv(result) 
			  //~ console.log(csv)
			  if(req.query.format) {
				  if(req.query.format == 'csv') {
					res.set('Content-Type', 'text/plain')
					res.send(csv) 
				  } else {
					res.set('Content-Type', 'text/xml')
					res.send(rawResponse)
				  }
			  } else {
  			    res.set('Content-Type', 'text/xml')
			    res.send(rawResponse)
			  }
			  return
		  })
	  //~ } else {
		  //~ res.render('getEstaciones2',{Username: req.query.username, Password: req.query.password})
		  //~ console.log('getEstaciones2 form rendered')
		  //~ return
	  //~ }
	})

	app.get('/getLast', (req, res) => {
		//~ console.log(req.query)
		//~ if(req.query.Username && req.query.Password) {
			console.log(req.query)
			console.log("intentando request")
			client.getLast({}, function(err, result, rawResponse) {
			  console.log(format(client.lastRequest))
			  if(err) {
				  res.status(500).send(err)
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

	app.get('/getLast2', (req, res) => {
		//~ console.log(req.query)
		//~ if(req.query.Username && req.query.Password) {
			console.log(req.query)
			console.log("intentando request")
			client.getLast2({}, function(err, result, rawResponse) {
			  console.log(format(client.lastRequest))
			  if(err) {
				  res.status(500).send(err)
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
	app.get('/getLast3', (req, res) => {
		//~ console.log(req.query)
		//~ if(req.query.Username && req.query.Password) {
			console.log(req.query)
			console.log("intentando request")
			client.getLast3({}, function(err, result, rawResponse) {
			  console.log(format(client.lastRequest))
			  if(err) {
				  res.status(500).send(err)
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
	app.get('/getLecturasAsXML', (req, res) => {
			console.log(req.query)
			console.log("intentando request")
			var args = {}
			if(req.query.estacion) {
				args.estacion = req.query.estacion
			}
			if(req.query.fechacarga) {
				args.fechacarga = req.query.fechacarga
			}
			if(req.query.fechalectura) {
				args.fechalectura = req.query.fechalectura
			}
			if(req.query.id) {
				args.id = {}
				if(req.query.id.estacion) {
					args.id.estacion = req.query.id.estacion
				}
				if(req.query.id.fechalectura) {
					args.id.fechalectura = req.query.id.fechalectura
				}
				if(req.query.id.sensor) {
					args.id.sensor = req.query.id.sensor
				}
			}
			if(req.query.sensor) {
				args.sensor = req.query.sensor
			}
			if(req.query.valor) {
				args.valor = req.query.valor
			}
			client.getLecturasAsXML(args, function(err, result, rawResponse) {
			  console.log(format(client.lastRequest))
			  if(err) {
				  res.status(500).send(err)
				  console.log(err.stack)
				  return 
			  }
			  console.log("success!")
			  res.set('Content-Type', 'text/xml')
			  res.send(rawResponse)
			  return
		  })
	})

	app.get('/getLecturasEstacionFecha', (req, res) => {
		//~ console.log(req.query)
		if(req.query.args0 && req.query.args1) {
			//~ console.log("intentando request")
			var args = {}
			args.args0 = req.query.args0
			args.args1 = req.query.args1
			client.getLecturasEstacionFecha(args, function(err, result, rawResponse) {
			  //~ console.log(format(client.lastRequest))
			  if(err) {
				  res.status(500).send(err)
				  //~ console.log(err.stack)
				  console.log("getLecturasEstacionFecha Failed. " + Date.now())
				  return 
			  }
			  console.log("getLecturasEstacionFecha Succeded. " + Date.now())
			  res.set('Content-Type', 'text/xml')
			  res.send(rawResponse)
			  return
		  })
	  } else {
		  console.log("mostrando formulario")
		  res.render('getLecturasEstacionFecha',req.query)
		  return
	  }
	})
	app.get('/getLecturasEstacionUltimasMinutos', (req, res) => {
		if(req.query.args1) {
			console.log(req.query)
			console.log("intentando request")
			var args = {args1: req.query.args1}
			if(req.query.args0) {
				args.args0 = req.query.args0
			}
			client.getLecturasEstacionUltimasMinutos(args, function(err, result, rawResponse) {
			  console.log(format(client.lastRequest))
			  if(err) {
				  res.status(500).send(err)
				  console.log(err.stack)
				  return 
			  }
			  console.log("success!")
			  res.set('Content-Type', 'text/xml')
			  res.send(rawResponse)
			  return
		  })
		} else {
			console.log('rendering form')
			res.render('getLecturasEstacionUltimasMinutos',req.query)
			return
		}
	})

	app.listen(port, (err) => {
		if (err) {
			return console.log('rrr',err)
		}
		console.log(`server listening on port ${port}`)
	})
})



function estaciones22csv(soapres) {
	if(!soapres) {
		return
	}
	//~ console.log(soapres)
	if(!soapres["return"]) {
		console.error("missing return tag")
		return
	}
	var csv = "index,activa,descripcion,desde,id,lat,long_\n"
	var i=0
	soapres["return"].forEach( it => {
		csv += i + "," + it.activa + "," + it.descripcion + "," + it.desde + "," + it.id + "," + it.lat + "," + it.long_ + "\n"
		i++
	})
	return csv
}
	
