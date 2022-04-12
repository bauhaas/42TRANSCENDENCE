import './ListChannels.scss';
import React, {Component, useState, useEffect} from "react";
import Nav from "../../Nav/Nav";
import CreateChanModal from "../../Utils/Modal/Modal";
import myAxios from "../../Utils/Axios/Axios";
import axios from "axios";


export default function ListPubChannels() {
	const [pubChan, pubChanSet] = React.useState([]);

	useEffect(() => {
		axios.get("http://localhost:3000/api/chat")
			.then((response) => {
				console.log("CHANNEL PUBLICS : ")
				pubChanSet(response.data);
				console.log(pubChan);
			})
			.catch((error) => {
				console.log(error);
			})
	}, [])
	
	return (
		<div className="listChannels">
			<h2>Public Channels</h2>
			<ul id="list--channels--ul">
				{pubChan.map(channel => 
					channel.public === true ?	<li key={channel.id} className="channel--list">{channel.name}</li> : "" 
				)}
			</ul>
		</div>
	);
}