import './Login2FA.scss';
import io from "socket.io-client";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Nav from "../../Nav/Nav";
import AuthCode, { AuthCodeRef }  from 'react-auth-code-input';
import ToastAlerts from '../../Utils/ToastAlerts/ToastAlerts';
import {ToastContainer} from "react-toastify";


export default function Login2fa() {
	const [activated2fa, setActivated2fa] = React.useState(false);
	const [loggedIn, setLoggedIn] = React.useState("false");
	const calledOnce = React.useRef(false);
	const [code, setCode] = React.useState("");
	const AuthInputRef = useRef<AuthCodeRef>(null);
	//const [load, setLoad] = React.useState(false);

	async function getUser() {

		//to do, a rechecker plus tard
		let check1 = localStorage.getItem("loggedIn");
		console.log("check1 is " + check1);
		if (check1 == "true")
		{
			console.log("Already logged in !");
			axios.defaults.headers.post['Access'] = '*/*';
			axios.defaults.withCredentials = true;

			//axios.get("http://localhost:3000/api/42auth/redirect-user")
			//.then(res => {console.log("Cool !")})
			//.catch((error) => {
			//	console.log(error);
			//	console.log("Error while being redirected !")
			//}
			//	);
			return ;
		}

		return ;//a revoir
		let url = "http://localhost:3000/api/auth/";
		let username = "";
		let activated = false;
		axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
		axios.defaults.withCredentials = true;
		await axios.get(url)
			.then(res => {
				console.log(res);
				console.log(res.data);
				username = res.data.login;
				activated = res.data.isTwoFactorAuthenticationEnabled;
				console.log("2FA activated ? " + activated);
				if (activated == false)
				{
					console.log("should redirect to user");
					setActivated2fa(false);
					setInterval(() =>
					{
						axios.get("http://localhost:3000/api/42auth/redirect-user")
						.catch((error) => {console.log("Error while being redirected !")});
					}, 1000)
				}
				else
				{
					console.log("should check the code before");
					setActivated2fa(true);
					//setLoad(true);
				}
			})
			.catch((err) => {
				console.log("Error while getting api auth");
			})

	}
	useEffect(() => {
		if (calledOnce.current) {
			return;}
		//getUser();
		calledOnce.current = true;
	}, []);

	let checkcode=(event: any) =>
	{
		event.preventDefault();
		console.log("Button clicked!");
		let toast = new ToastAlerts(null);
		if (code.length != 6)
		{
			toast.notifyDanger("❗️ Error, the verif code is too short.");
			return ;
		}
		console.log("Posting on api...");
		let url = "http://localhost:3000/api/2fa/log-in";
		axios.defaults.baseURL = 'http://localhost:3000/api/';
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.defaults.headers.post['Accept'] = '*/*';
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        axios.defaults.withCredentials = true;

		let bod = {
			twoFactorAuthenticationCode: code
		}

		let res = axios.post(url, bod)
		.then(res => {
			console.log("Succesfully logged in with 2fa!");
			console.log(res);
			console.log(res.data);
			localStorage.setItem("2faverif", "true");
			window.top.location = "http://localhost:3030/user";
			//setCode("");
			//toast.notifySuccess("✅ Success ! Redirecting...")
			//setInterval(() => {
			//	console.log("Loading");
			//	let check = localStorage.getItem("loggedIn");
			//	localStorage.setItem("2faverif", "true");
			//	console.log("chek is " + check);
			//}, 1000)

		})
		.catch((error) => {
			console.log("Catched error while logging in with 2fa");
			console.log(error);
			toast.notifyDanger("😢 Error while logging in with 2fa");
		})
	}

	return (
		<div>
			<div id="login--2FA" className="container">
				<div className="row d-flex justify-content-center text-center">
					<div className="col-6">
						<div id="div--main--2fa">
							<br />
							<h1 className="game--rules--title">✨ 2 factor authentication</h1>
							<br />
							<div id="authcode-2fa">
								<AuthCode
									allowedCharacters='numeric'
									ref={AuthInputRef}
									inputClassName="auth--code_2fa"
									//id="auth--code"
									onChange={function (res: string): void {
									setCode(res);
									//console.log("code is " + code);
								} } />
								<button type="submit" className="btn btn-outline-dark" value="Submit" id="check--button" onClick={checkcode}>Check code</button>
								<ToastContainer
									position="top-right"
									autoClose={5000}
									hideProgressBar={false}
									newestOnTop={false}
									closeOnClick
									rtl={false}
									pauseOnFocusLoss
									draggable
									pauseOnHover
								/>
							</div>
						</div>
						{/*:
						<div className="container">
							<div className="row d-flex justify-content-center">
								<h1 id="loading--title"> ⏱ Loading...</h1>
							</div>
						</div>
						}*/}
					</div>
				</div>
			</div>
		</div>
	);
}
