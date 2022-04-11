import React, {useState, useEffect, useRef, useContext} from 'react';
import './Profile.scss';
import axios from "axios";
import Nav from "../Nav/Nav";
import { useParams } from 'react-router-dom'
import NotFound from "../../components/NotFound/NotFound";
import MyAxios from '../Utils/Axios/Axios';
import MatchHistory from '../MatchHistory/MatchHistory';

//export interface ProfileProps {
//	login?: string,
//	//children?: React.ReactNode | React.ReactChild | React.ReactChildren | React.ReactChild[] | React.ReactChildren[]
//}

export default function Profile() {

	const calledOnce = React.useRef(false);
	const [userOK, setUserOk] = React.useState(false);
	const [is42, setis42] = React.useState(false);

	//const loginPram =  useState(params.username)

	function getUserLogin(log: string) {
		//console.log("Login is " + log);
		let url = "http://localhost:3000/api/user/".concat(login);

		axios.get(url)
		.then(res => {
			console.log(res);
			setUserOk(true);
		})
		.catch((err) => {
			console.log("Error while getting api auth");
			console.log(err);
		})
	}

	useEffect(() => {
	if (calledOnce.current) {
		return;}
	calledOnce.current = true;
}, []);

	const {login} = useParams();
	console.log("Param Login is " + {login});
	console.log("Param Login is " + login);

	//function renderImage(avatar: string, login: string, ftlogin: string) {
	//	let is42 = false;
	//	if (ftlogin == null)
	//		is42 = false;
	//	else
	//		is42 = true;

	//	let imageName = "alt-photo";

	//	if (avatar.startsWith("http")) {

	//		let imageUser42 = "https://cdn.intra.42.fr/users/".concat(login).concat(".jpg");
	//		var myImg = document.getElementById(login) as HTMLImageElement;
	//		if (is42 == false) {
	//			myImg.src = "https://pbs.twimg.com/profile_images/1380427848075317248/nxgi57Th_400x400.jpg";
	//			return;
	//		}
	//		else {
	//			if (imageUser42)
	//				myImg.src = imageUser42;
	//			else
	//				myImg.src = avatar;
	//			return;
	//		}
	//	}

	//	let url = "http://localhost:3000/api/user/".concat(avatar).concat("/avatar/");
	//	let res = axios.get(url, { responseType: 'blob' })
	//		.then(res => {
	//			let myImage: HTMLImageElement = document.querySelector("#".concat(login));
	//			var objectURL = URL.createObjectURL(res.data);
	//			myImage.src = objectURL;
	//			return (<img className="profile--pic" src={myImage.src} alt={imageName} id={login} height="80" />);
	//		})
	//		.catch((error) => {
	//			console.log("Catched error during get/fileId/avatar");
	//			return (<img className="profile--pic" src="https://pbs.twimg.com/profile_images/1380427848075317248/nxgi57Th_400x400.jpg" alt={imageName} height="80" width="80" id={props.login} />);
	//		})
	//}

	function renderImage(login: string) {
		let ax = new MyAxios(null);
		return (ax.render_avatar(login));
	}

    return (
        <div id="profile--div">
			<Nav />
			<div className="container">
				<div className="row d-flex justify-content-center text-center">
					<br />
					<div className="col-6" id="main--profile--div">
						<div>
						<br />
						{getUserLogin(login)}
						{userOK == true ?
							<div id="profile--div">
								<img id={login} className="profile--pic" src="" width="100" height="100"/>
								<br />
								{renderImage(login)}
								<h2 id="profile-title">{login.toUpperCase()}</h2>
								<br/>
								<MatchHistory />
								<br/>
							</div>
						: <>
							<h1><span id="oops">Oops...</span></h1>
							<h2><span id="page-not-found">Page not found</span></h2>
							<button type="button" className="btn btn-outline-dark"
								onClick={(e) => {window.top.location = "http://localhost:3030/game"}}
							>Go to game</button>
						</>
						}
					</div>
				</div>
			</div>
		</div>
				{/*<p id="profile--p">
					Profile page
				</p>*/}
    </div>
    )
}