import './MiniDisplay.scss';
import MyAxios from '../../Utils/Axios/Axios';
import React, { Component, useState, useEffect, Suspense, lazy } from 'react';
import { AiOutlineCloseCircle, AiFillPlusCircle } from "react-icons/ai";
import { BsFillPersonPlusFill, BsFillPersonXFill } from "react-icons/bs";
import io from "socket.io-client";
import axios from 'axios';
import {Oval, Hearts} from "react-loader-spinner";

export interface MiniDisplayProps {
	login?: string,
	status?: string,
	avatar?: string,
	isft?: boolean,
	ftlogin?: string,
	user?: any;
	//children?: React.ReactNode | React.ReactChild | React.ReactChildren | React.ReactChild[] | React.ReactChildren[]
}

export default function MiniDisplay(props: MiniDisplayProps) {
	const [load, setLoad] = React.useState(false);
	const calledOnce = React.useRef(false);
	const [status, setStatus] = React.useState(props.status);
	const [username, setUsername] = React.useState("");

	function renderImage(avatar: string, login: string, ftlogin: string) {
		if (!avatar)
			return;
		let is42 = false;

		ftlogin == null || ftlogin == undefined || ftlogin == "" ? is42 = false : is42 = true;

		//console.log("ftlogin is " + ftlogin);

		let imageName = "alt-photo";

		let chosenLogin = "";
		if (login != ftlogin && login != "" && login != null && login != undefined)
			chosenLogin = ftlogin;
		else
			chosenLogin = login;

		//console.log("chosen login is " + chosenLogin);

		if (avatar.startsWith("http")) {
			let imageUser42 = "https://cdn.intra.42.fr/users/".concat(chosenLogin).concat(".jpg");
			var myImg = document.getElementById(props.login) as HTMLImageElement;
			if (is42 == false)
			{
				myImg.src = "https://pbs.twimg.com/profile_images/1380427848075317248/nxgi57Th_400x400.jpg";
				return;
			}
			else {
				if (imageUser42)
					myImg.src = imageUser42;
				else
					myImg.src = avatar;
				return;
			}
		}

		let url = "http://localhost:3000/api/user/".concat(avatar).concat("/avatar/");

		let res = axios.get(url, { responseType: 'blob' })
			.then(res => {
				let myImage: HTMLImageElement = document.querySelector("#".concat(props.login));
				var objectURL = URL.createObjectURL(res.data);
				myImage.src = objectURL;
				return (<img className="profile--pic" src={myImage.src} alt={imageName} id={props.login} height="80" />);
			})
			.catch((error) => {
				console.log("Catched error during get/fileId/avatar");
				return (<img className="profile--pic" src="https://pbs.twimg.com/profile_images/1380427848075317248/nxgi57Th_400x400.jpg" alt={imageName} height="80" width="80" id={props.login} />);
			})
	}

	// REPRENDRE USER ICI - SOCKET
	async function getUser() {
		let url = "http://localhost:3000/api/auth/";
		let username = "";
		axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
		axios.defaults.withCredentials = true;
		await axios.get(url)
			.then(res => {
				username = res.data.login;
			})
			.catch((err) => {
				console.log("Error while getting api auth");
			})
	}

	useEffect(() => {
		if (calledOnce.current) {
			return;
		}
		setLoad(true);
		calledOnce.current = true;
	}, []);


	const [color, setColor] = React.useState("");
	let url = "http://localhost:3000/api/user/".concat(props.login);
	let res = axios.get(url)
		.then(res => {
			if (res.data.status == "offline")
				setColor("grey")
			if (res.data.status == "online")
				setColor("green")
			if (res.data.status == "ingame")
				setColor("purple")
		})
		.catch((error) => {
			console.log("Catched error during get/logind/user");
		})

	function addContact(login: string) {
		let ax = new MyAxios(null);
		return (ax.post_api_user_relation_sendInvation_id(login));
	}

	function blockContact(login: string) {
		let ax = new MyAxios(null);
		return (ax.post_relation_block(login));
	}

	function gotoprofile()
	{
		let url = "http://localhost:3030/profile/".concat(props.login);
		window.top.location = url;
	}

	return (
		<>
			<li id="minidisplay--div" className="list-group-item" key={props.login}>
			<Suspense fallback={<Hearts color="#ffe4e1" height={100} width={100} key={props.login}/>}>
					<img className="profile--pic" id={props.login} src="" width="100" height="100" onClick={gotoprofile} />
					{load == true ? renderImage(props.avatar, props.login, props.ftlogin) : ""}
					<svg className="log--color" height="40" width="40">
						<circle cx="20" cy="20" r="15" fill={color} stroke="white" strokeWidth="3" /></svg>
					<br />
					<p className="user--p" id="mini--login">{props.login}</p>
					<p className="user--p" id="mini--status">{status}</p>
					<i className="user--action" onClick={() => addContact(props.login)}>{<BsFillPersonPlusFill />}</i>
					<i className="user--action" onClick={() => blockContact(props.login)}>{<BsFillPersonXFill />}</i>
			</Suspense>
			</li>
		</>
	);
}
