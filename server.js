const { instrument } = require('@socket.io/admin-ui');

// * Server setup
const io = require('socket.io')(3000, {
	cors: {
		origin: ['http://127.0.0.1:5173', 'https://admin.socket.io'],
		credentials: true,
	},
});

// * Namespaces
const userIo = io.of('/user');
userIo.on('connection', (socket) => {
	console.log(
		`New user ${socket.id}, connected to namespace /user with the username: ${socket.username}`
	);

	socket.on('send-message', (message, room) => {
		if (room === '') {
			socket.broadcast.emit('receive-message', message);
		} else {
			socket.to(room).emit('receive-message', message);
		}
	});

	socket.on('join-room', (room, callback) => {
		socket.join(room);
		callback(`Se unió a la sala: ${room}`);
	});
});

// * Middlewares
userIo.use((socket, next) => {
	if (socket.handshake.auth.token) {
		socket.username = validateToken(socket.handshake.auth.token);
		next();
	} else {
		next(new Error('Authentication error: Please send token'));
	}
});

function validateToken(token) {
	// * Get username from token
	console.log('token' + token);
	return token;
}

// * Admin UI
instrument(io, { auth: false });

io.on('connection', (socket) => {
	console.log('New user connected', socket.id);
	socket.on('send-message', (message, room) => {
		if (room === '') {
			socket.broadcast.emit('receive-message', message);
		} else {
			socket.to(room).emit('receive-message', message);
		}
	});

	socket.on('join-room', (room, callback) => {
		socket.join(room);
		callback(`Se unió a la sala: ${room}`);
	});
});

//function calculates time difference between two dates in minutes hrs days
