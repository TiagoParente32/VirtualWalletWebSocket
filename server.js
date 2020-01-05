var app = require('http').createServer();

var io = require('socket.io')(app);
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'ipleiriadad@gmail.com',
		pass: 'zsjojgjnbfpxwdmj'
	}
});

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
		socket.email = emailToSetToSocket;
		var socketRepetido = 0;
		sockets.forEach((sockets) =>{
			if(sockets.email == emailToSetToSocket){
				socketRepetido = 1;
			}
		});
		if(!socketRepetido){
			sockets.push(socket);
			console.log("Socket " + socket.email + " adicionado 'a lista => size = " + sockets.length);
		}
		socketRepetido = 0;
	});

	socket.on("userUpdated", (email)=>{
		userEstaOnline = 0;
		sockets.forEach(socket => {
			if(email == socket.email){
				userEstaOnline = 1;
				socketID = socket.id;
			}
		});

		if(userEstaOnline){
			console.log("Foi encontrado o email: " + email);
			io.to(`${socketID}`).emit("updateData"); //so' para quando o user esta a visualizar os seus movimentos
			io.to(`${socketID}`).emit("notificationFromServer", "You have a new movement on your wallet!"); //sempre que o user estiver na aplicação
			console.log("Mostrar notificação na aplicação");
		}else{
			var mailOptions = {
				from: 'ipleiriadad@gmail.com',
				to: email,
				subject: 'Check out your wallet',
				text: 'Check out you virtual wallet, you have a new movement!'
			};
	
			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});
			console.log("A enviar email para o user: " + email);
		}
		userEstaOnline = 0;
	});
	socket.on("disconnect", ()=>{
		console.log("Antes:");
		sockets.forEach(socket => {
            console.log("ID: " + socket.id + " email: " + socket.email);
        });
		sockets.splice(sockets.indexOf(socket),1);
        console.log("Depois:");
        sockets.forEach(socket => {
            console.log("ID: " + socket.id + " email: " + socket.email);
        });
	});

	socket.on("logout", (socketID)=>{
		console.log("Antes:");
		sockets.forEach(socket => {
            console.log("ID: " + socket.id + " email: " + socket.email);
        });
        sockets.forEach(socket => {
            console.log("ID: " + socket.id + " email: " + socket.email);
            if(socket.id == socketID){
                sockets.splice(sockets.indexOf(socket),1);
            }
        });
        console.log("Depois:");
        sockets.forEach(socket => {
            console.log("ID: " + socket.id + " email: " + socket.email);
        });
    });
});
