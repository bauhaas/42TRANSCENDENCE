import React, { Component, useState, useEffect } from 'react';
import Nav from "../Nav/Nav";
import './User.scss';
import axios from 'axios';
import MyAxios from '../Utils/Axios/Axios';
import { ToastContainer, toast } from 'react-toastify';
import ToastAlerts from '../Utils/ToastAlerts/ToastAlerts';
import EditUsernameModal from "./editUsername/EditUsername";
import Dashboard from '../Dashboard/Dashboard';
import Badge from "../Dashboard/Badge/Badge"
import Achievements from "../Achievements/Achievements";
import {Modal} from "react-bootstrap"
import Settings from "./Settings/Settings"
import MatchHistory from '../MatchHistory/MatchHistory';
import Footer from "../Footer/Footer";

//TODO: a cleaner ?
export interface UserfuncProps {
	username?: string,
	email?: string,
	password?: string,
	password_conf?: string,
	avatar?: string,
	totalGames?: number,
	totalWins?: number,
	totalLoss?: number,
	winLoss?: number
}

export default function User(props: UserfuncProps) {
	const [username, setUsername] = React.useState("");
	const [logged, setLogged] = React.useState(true);
	const [is42, setis42] = React.useState(false);
	const [login42, setlogin42] = React.useState("");
	const calledOnce = React.useRef(false);
	const [loaded, setLoaded] = React.useState(true);
	const [authorized, setAuthorized] = React.useState(true);

	async function getUser() {
		//TODO: revoir plus tard pour affichage conditionnel
		/*
		let log = localStorage.getItem("loggedIn");
		setLogged(log == "true" ? true : false);

		if (log == "false")
		{
			console.log("Not logged !");
			return ;
		}*/

		let url = "http://localhost:3000/api/auth/";

		axios.defaults.baseURL = 'http://localhost:3000/api/';
		axios.defaults.headers.post['Content-Type'] = 'application/json';
		axios.defaults.headers.post['Accept'] = '*/*';
		axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
		axios.defaults.withCredentials = true;

		let username = "";
		await axios.get(url)
			.then(res => {
				username = res.data.login;
				console.log(res);
				if (res.data.login42 != null && res.data.login42 != undefined &&  res.data.login42 != "")
				{
					setis42(true);
					setlogin42(res.data.login42);
					localStorage.setItem("login", res.data.login);
					localStorage.setItem("login42", res.data.login42);
					setLoaded(true);
					//setAuthorized(true);
				}
				setUsername(username);
			})
			.catch((err) => {
				console.log("Auth returned 400 -> missing cookie");
				//setAuthorized(false);
				//console.log("Error while getting api auth - Maybe you are in incognito mode");
				//console.log(err);
			})
	}

	useEffect(() => {
		if (calledOnce.current) {
			return;}
		getUser();
		calledOnce.current = true;
	}, []);

	function renderImage(login: string) {
		let ax = new MyAxios(null);
		let log42 = localStorage.getItem("login42");
		let haschanged = false;
		if (login != log42)
			haschanged = true;
		if (log42 != "" && log42 != null && log42 != undefined)
			return (ax.render_avatar(login, log42, haschanged));
		return (ax.render_avatar(login, "", haschanged));
	}

	return (
		<div id="user--div">
			<Nav />
			<div className="container">
				<div className="row d-flex justify-content-center text-center">
					<div className="col-9">
						{/*{
							authorized == false?
							<p className="not-authenticated">You are not properly authenticated.</p>
							: ""
						}*/}
						{
							loaded ?
								<>
								<div className="user--stats" key={username}>
									<img id={username} className="profile--pic" height="80" width="80"/>
									{renderImage(username)}
									<br />
									<h2 id="user--data">{username}</h2>
										<div className="col-9 mx-auto text-center" id="input-div">
											<br />
											<Achievements login={username}/>
											<br />
											{/*<Badge />*/}
											<Badge />
											<br />
											<MatchHistory login={username}/>
											<br/>
											<Settings username={username} login42={localStorage.getItem("login42")}/>
											<br />
										</div>
								</div>
								</>
								: <>
									<p>You are not logged in.</p>
									</>}
						</div>
					</div>
				</div>
			</div>
	);
};
