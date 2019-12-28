/*jshint esversion: 6 */

var app = require('http').createServer();

// Se tiverem problemas com "same-origin policy" deverão activar o CORS.

// Aqui, temos um exemplo de código que ativa o CORS (alterar o url base) 

// var app = require('http').createServer(function(req,res){
// Set CORS headers
//  res.setHeader('Access-Control-Allow-Origin', 'http://---your-base-url---');
//  res.setHeader('Access-Control-Request-Method', '*');
//  res.setHeader('Access-Control-Allow-Methods', 'UPGRADE, OPTIONS, GET');
//  res.setHeader('Access-Control-Allow-Credentials', true);
//  res.setHeader('Access-Control-Allow-Headers', req.header.origin);
//  if ( req.method === 'OPTIONS' || req.method === 'UPGRADE' ) {
//      res.writeHead(200);
//      res.end();
//      return;
//  }
// });

// NOTA: A solução correta depende da configuração do próprio servidor, 
// e alguns casos do próprio browser.
// Assim sendo, não se garante que a solução anterior funcione.
// Caso não funcione é necessário procurar/investigar soluções alternativas

var io = require('socket.io')(app);

var LoggedUsers = require('./loggedusers.js');

app.listen(8080, function(){
    console.log('listening on *:8080');
});

// ------------------------
// Estrutura dados - server
// ------------------------

// loggedUsers = the list (map) of logged users. 
// Each list element has the information about the user and the socket id
// Check loggedusers.js file

let loggedUsers = new LoggedUsers();
var sockets = [];

io.on('connection', function (socket) {	
	console.log('client has connected (socket ID = '+socket.id+ ')');

	socket.on("sendSocketEmailToServer", (emailToSetToSocket)=>{
		console.log(sockets.length);
		socket.email = emailToSetToSocket;
		console.log("socket.id = " + socket.id + " socket.email = " + socket.email);
		sockets.forEach((sockets) =>{
			console.log("Email: " + sockets.email);
		});
		sockets.push(socket);
		console.log(sockets.length);
	});

	socket.on("userUpdated", (email)=>{
		console.log("Searching for this email on the list of sockets");
		sockets.forEach(sockets => {
			if(email == sockets.email){
				console.log("Foi encontrado o email: " + email);
				io.to(`${sockets.id}`).emit("updateData"); //so' para quando o user esta a visualizar os seus movimentos
				io.to(`${sockets.id}`).emit("notificationFromServer", "You have a new movement on your wallet!"); //sempre que o user estiver na aplicação
				console.log("Mostrar notificação na aplicação");
			}else{
				socket.emit("sendEmail", email);
				console.log("A enviar email para o user: " + email);
			}
		});
	})
	/*
	socket.on("disconnect", (email)=>{
		console.log(email);
		console.log("Tamanho do array antes: " + sockets.lenght);
		sockets.forEach(socket => {
			if(email == socket.email){
				sockets.pull(socket);
			}
		});
		console.log("O user com o email " + email + " saiu da aplicação");
		console.log("Tamanho do array depois: " + sockets.lenght);
	})
	*/
});
