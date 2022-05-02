import './Channels.scss';
import Nav from '../Nav/Nav';
import TypingMessage from "./TypingMessage/TypingMessage";
import ListDiscussions from "./ListDiscussions/ListDiscussions";
import ListParticipant from './ListParticipant/ListParticipant';
import CreateChan from './CreateChan/CreateChan';
import React, { useState, useEffect } from "react";
import MyAxios from '../Utils/Axios/Axios';
import ToastAlerts from '../Utils/ToastAlerts/ToastAlerts';
import { ToastContainer, toast } from 'react-toastify';
import { io } from "socket.io-client";
import ListChannels from './ListChannels/ListChannels';
import axios from 'axios';

interface ChatProps {
	username?: string
}

let selectedUser = "";

export default function Channels(props: ChatProps) {
	const calledOnce = React.useRef(false);
	const [username, setUsername] = React.useState("");
	const [load, setLoad] = React.useState(false);
	const [isChan, setIsChan] = React.useState(true);
	const [hasPass, setHasPass] = React.useState(false);
	const [activeID, setActiveID] = React.useState("");
	const [activeName, setActiveName] = React.useState("");
	const [hide, setHide] = React.useState(false);
	const [isBanned, setIsBanned] = React.useState(false);


	const [socket, setSocket] = React.useState(io("http://".concat(process.env.REACT_APP_IP).concat(":3000/chat"), { query: { username: username } }));

	function acceptInvitePlay()
	{
		window.top.location = "http://".concat(process.env.REACT_APP_IP).concat(":3030/game?vs=").concat(selectedUser);;
	}

	const InvitetoPlay = () => {
	return(
	<div>
		{selectedUser} wants to play with you !
		<button className="btn btn-dark" onClick={acceptInvitePlay}>Accept</button>
	</div>)
	}

	  var socket2 = io("http://".concat(process.env.REACT_APP_IP).concat(":3000/game"), { query: { username: username } });
	
	  socket2.on('inviteToPlay', (...args) => {

	    if (username == args[1] && selectedUser != args[0])
	      selectedUser = args[0];
	    else
	      return;

	    toast.dark(<InvitetoPlay />, {
	              position: "top-right",
	              autoClose: 10000,
	              hideProgressBar: false,
	              closeOnClick: false,
	              pauseOnHover: false,
	              draggable: false,
	              closeButton: false
	          });
	  });

	function getUser() {
		let url = "http://".concat(process.env.REACT_APP_IP).concat(":3000/api/auth/");
		axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
		axios.defaults.withCredentials = true;
		/*await*/
		axios.get(url)
			.then(res => {
				setUsername(res.data.login);
			})
			.catch((err) => {
				//console.log("Error while getting api auth");
				;
			})
		setLoad(true);
	}

	useEffect(() => {
		getUser();
	}, [username]);

	return (
		<div id="channels">
			<Nav />
			<div className="container">
				<div className="row" id="row_chat">
					{load === true ?
						<ListChannels
							socket={socket}
							login={username}
							setIsChan={setIsChan}
							setHasPass={setHasPass}
							setActiveID={setActiveID}
							setActiveName={setActiveName}
							setHide={setHide}
							setIsBanned={setIsBanned}
						/>
						: ""}
					{load === true ?
						<ListDiscussions
							socket={socket}
							login={username}
							isChan={isChan}
							activeID={activeID}
							activeName={activeName}
							hide={hide}
							setIsBanned={setIsBanned}
							isBanned={isBanned}
						/>
						: ""}
					{load === true ?
						<ListParticipant
							socket={socket}
							login={username}
							isChan={isChan}
							hasPass={hasPass}
							setHasPass={setHasPass}
							activeID={activeID}
							activeName={activeName}
							setHide={setHide}
							hide={hide}
							isBanned={isBanned}
						/>
						: ""}
				</div>
			</div>
		</div>
	);
}
