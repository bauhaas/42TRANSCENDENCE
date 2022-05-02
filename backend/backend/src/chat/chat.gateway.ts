import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { Logger } from "@nestjs/common";
import { BanDto, CreateChatDto, MuteDto } from './dto/chat.dto';

const clients = [];

@WebSocketGateway({ namespace: 'chat', cors: true })

export class ChatGateway implements OnGatewayConnection {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger("chatGateway");

	constructor(
		private readonly chatService: ChatService,
		private readonly userService: UserService
	) { }

	async handleConnection(socket: Socket, ...args: any[]) {
		this.logger.log("Client connected: " + socket.handshake.query.username);
		this.userService.updateStatus(String(socket.handshake.query.username), "online");
		clients.push(socket);
		clients.forEach(function (client) {
			client.emit("updateStatus", String(socket.handshake.query.username), "online");
		});
	}

	async handleDisconnect(socket: Socket, ...args: any[]) {
		this.logger.log("Client disconnected: " + socket.handshake.query.username);
		this.userService.updateStatus(String(socket.handshake.query.username), "offline");
		clients.forEach(function (client) {
			client.emit("updateStatus", String(socket.handshake.query.username), "offline");
		});
		const index = clients.indexOf(socket);
		if (index > -1)
			clients.splice(index, 1);
	}

	@SubscribeMessage('message')
	async messageMessage(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		/*
		console.log(body + 'event message');
		console.log(process.env.TEST);
		const b = body.split(':');
		const author = await this.userService.getUserByLogin(b[0]);
		const message = await this.chatService.saveChatMessage(b[1], b[2], author);

		this.server.emit('newMessageEvent', true);*/
		console.log(body + 'event message');
		console.log(process.env.TEST);
		const b = body.split(':');
		const author = await this.userService.getUserByLogin(b[0]);
		const message = await this.chatService.saveChatMessage(b[1], b[2], author);

		const messages = await this.chatService.getMessagesbyName(b[1]);
		this.server.emit('refreshMessages', messages, b[1]);
	}

	@SubscribeMessage('requestAllMessages')
	async requestAllMessagesbyName(@ConnectedSocket() socket: Socket, @MessageBody() body: number) {
		if (body) {
			const messages = await this.chatService.getMessagesById2(body, String(socket.handshake.query.username));
			socket.emit('sendAllMessages', messages);
		}
	}

	@SubscribeMessage('updateChat')
	async updateChat(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		this.server.emit('newMessageEvent', true);
		this.server.emit('updateParticipants', true);
	}

	@SubscribeMessage('refresh')
	async refreshChat(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		console.log(body + 'event refresh');
		//const b = body.split(':');
		//const author = await this.userService.getUserByLogin(b[0]);
		//const message = await this.chatService.saveChatMessage(b[1], b[2], author);

		//const messages = await this.chatService.getMessagesbyName(b[1]);
		const chat = await this.chatService.getChatByName(body);
		const users = await this.chatService.getUsersInChannel(chat.id);
		this.server.emit('refreshParticipants', users, body);
	}

	@SubscribeMessage('mute')
	async muteUser(@ConnectedSocket() socket: Socket, @MessageBody() body: MuteDto) {
		//if (!socket.handshake.query.username)
		//	return;
		//console.log("bt " + body.time)
		console.log(body.user + " " + body.mute + ' event isMute in chat ' + body.chatName);
		const user = await this.userService.getUserByLogin(body.user);
		const admin = await this.userService.getUserByLogin(body.admin);
		if (body.mute)
			this.chatService.mute(body.chatName, body.user, admin, body.time);
		else
			this.chatService.active(body.chatName, body.user, admin);
		this.server.emit('isMute', user.login, body.mute, body.time);

	}

	@SubscribeMessage('ban')
	async banUser(@ConnectedSocket() socket: Socket, @MessageBody() body: BanDto) {
		console.log(body.user + " " + body.ban + 'event isBan');
		//const b = body.split(':');
		//const author = await this.userService.getUserByLogin(b[0]);
		//const message = await this.chatService.saveChatMessage(b[1], b[2], author);

		//const messages = await this.chatService.getMessagesbyName(b[1]);
		//const chat = await this.chatService.getChatByName(body);
		const user = await this.userService.getUserByLogin(body.user);
		this.server.emit('isBan', user.login, body.ban);
	}

	@SubscribeMessage('requestAllUsers')
	async requestAllUsers(@ConnectedSocket() socket: Socket, @MessageBody() body: number) {
		if (body) {
			const users = await this.chatService.getUsersInChannel(body);
			socket.emit('sendAllUsers', users);
			//this.server.emit('sendAllUsers', users, body);
		}
	}
}
