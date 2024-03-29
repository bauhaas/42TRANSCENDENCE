import React, { useEffect } from 'react';
import './Profile.scss';
import axios from "axios";
import Nav from "../Nav/Nav";
import { useParams } from 'react-router-dom'
import MyAxios from '../Utils/Axios/Axios';
import MatchHistory from '../MatchHistory/MatchHistory';
import Achievement from '../Achievements/Achievements';
import Badge from "../Badge/Badge";

let url_begin = "";
if (process.env.REACT_APP_IP == "" || process.env.REACT_APP_IP == undefined)
	url_begin = "http://localhost";
else
	url_begin = "http://".concat(process.env.REACT_APP_IP);

export interface ProfileProps {

	login?: string,
	avatar?: any,
	login42?: string,
}

export default function Profile() {
	const [color, setColor] = React.useState("green");
	const [status, setStatus] = React.useState("online");
	// const calledOnce = React.useRef(false);
	const [userOK, setUserOk] = React.useState(false);
	const { login } = useParams();

	const [isFriend, setisFriend] = React.useState(false);
	const [isBlocked, setisBlocked] = React.useState(false);

	const [receivedInvitation, setReceivedInvitation] = React.useState(false);
	const [sentInvitation, setSentInvitation] = React.useState(false);

	const [load, setLoad] = React.useState(false);
	const [points, setPoints] = React.useState(0);
	const [rank, setRank] = React.useState(0);
	const [totalGames, setTotalGames] = React.useState(0);
	const [loss, setLoss] = React.useState(0);
	const [wins, setWins] = React.useState(0);
	const [ratio, setRatio] = React.useState(0);
	const [xp, setXp] = React.useState(0);
	const [level, setLevel] = React.useState(0);
	const [nextlevel, setNextLevel] = React.useState(0);
	const [pendingInvite, setPendingInvite] = React.useState(false);
	const [avatar, setAvatar] = React.useState();
	const [login42, setLogin42] = React.useState("");

	function getUserLogin(log: string) {
		let url = "";
		if (process.env.REACT_APP_IP == "" || process.env.REACT_APP_IP == undefined)
			url = "http://localhost:3000/api/user/".concat(login);
		else
			url = "http://".concat(process.env.REACT_APP_IP).concat(":3000/api/user/").concat(login);

		axios.get(url)
			.then(res => {
				setUserOk(true);
				setNextLevel(res.data.percent_to_next_lvl);
				setLevel(res.data.level);
				setRank(res.data.rank)
				setPoints(res.data.points);
				setTotalGames(res.data.total_games);
				setLoss(res.data.total_loss);
				setWins(res.data.total_wins);
				setRatio(res.data.win_loss_ration);
				setXp(res.data.xp);
				setAvatar(res.data.avatar);
				setLogin42(res.data.login42);
				if (res.data.status === "offline")
					setColor("grey")
				if (res.data.status === "online") {
					setColor("green");
					setStatus("online");
				}
				if (res.data.status === "ingame") {
					setColor("purple");
					setStatus("ingame")
				}
			})
			.catch((err) => {
				;
			})
		setLoad(true);
	}

	function renderImage(avatar: string, login: string, ftlogin?: string, extra?: string) {
		if (!avatar)
			return;

		if (avatar.startsWith("http"))
		{
			let imageUser42 = "";
			imageUser42 = "https://cdn.intra.42.fr/users/".concat(ftlogin).concat(".jpg");
			return (<img className="profile--pic"
				width="100" height="100"
				src={imageUser42}
				id={login} />);

		}

		let url = "";

		if (process.env.REACT_APP_IP == "" || process.env.REACT_APP_IP == undefined)
			url = "http://localhost:3000/api/user/".concat(avatar).concat("/avatar");
		else
			url = "http://".concat(process.env.REACT_APP_IP).concat(":3000/api/user/").concat(avatar).concat("/avatar/");

		let res = axios.get(url, { responseType: 'blob' })
			.then(res => {
				let myImage: HTMLImageElement = document.querySelector("#".concat(login));
				var objectURL = URL.createObjectURL(res.data);
				myImage.src = objectURL;
				return (<img className="profile--pic"
					width="100" height="100"
					src={myImage.src} id={login} />);
			})
			.catch((error) => {
				return (<img className="profile--pic"
					width="100" height="100"
					src="https://pbs.twimg.com/profile_images/1380427848075317248/nxgi57Th_400x400.jpg" id={login} />);
			})
	}

	useEffect(() => {
		// if (calledOnce.current) {
		// 	return;
		// }
		getUserLogin(login)
		buttonToDisplay();
		return () => { setLoad(false); };
		// calledOnce.current = true;
	}, []);

	function buttonToDisplay() {

		let friends: boolean;
		let url = url_begin.concat(":3000/api/user/relation/relationStatusWith/").concat(login);

		axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
		axios.defaults.withCredentials = true;

		axios.get(url)
			.then(res => {
				let relation = res.data;
				if (relation.status == "accepted") {
					friends = true;
					setisFriend(true);
				}
				else if (relation.status == "pending" && relation.receiver == login) {
					setSentInvitation(true);
					setPendingInvite(true);
				}
				else if (relation.status == "pending" && relation.sender == login) {
					setReceivedInvitation(true);
					setPendingInvite(true);
				}
				else if (relation.status == "blocked" && relation.receiver == login) {
					setisBlocked(true);
				}
				else {
					setisFriend(false);
				}
			})
			.catch((error) => {
				;
			})
	}

	function inviteFriend() {
		let ax = new MyAxios(null);
		ax.post_api_user_relation_sendInvation_id(login);
		window.top.location = url_begin.concat(":3030/profile/").concat(login);
	}

	function acceptFriend() {
		let ax = new MyAxios(null);
		ax.post_api_user_relation_answerInvitation_id(login, "accepted", "");
		window.top.location = url_begin.concat(":3030/profile/").concat(login);
	}

	function declineFriend() {
		let ax = new MyAxios(null);
		ax.post_api_user_relation_answerInvitation_id(login, "declined", "");
		window.top.location = url_begin.concat(":3030/profile/").concat(login);
	}

	function block() {
		let ax = new MyAxios(null);
		ax.post_relation_block(login, "people");
		window.top.location = url_begin.concat(":3030/profile/").concat(login);
	}

	function unblock() {
		let ax = new MyAxios(null);
		ax.delete_relation_unblock(login, "");
	}

	function remove() {
		let ax = new MyAxios(null);
		ax.delete_relation_id(login, "");
		//document.getElementById("remove--button").remove();
	}

	return (
		<>
			<div id="profile--div">
				<Nav />
				<div className="container">
					<div className="row d-flex justify-content-center text-center">
						<br />
						<div className="col-9" id="main--profile--div">
							<div>
								<br />
								{userOK == true ?
									<div id="profile--div">
										<h3 className="profile--type">{isFriend == true ? "Friend profile" : "Public profile"}</h3>
										<br />
										<div id="text-type">{isFriend == true ? "You are able to see a detailed profile because you are friends 🥰 !"
											: "You are not able to see a detailed profile because you are not friends 😢 !"}</div>
										<img id={login} width="100" height="100" className="profile--pic" src="" />
										{renderImage(avatar, login, login42)}
										<svg className="log--color" height="40" width="40">
											<circle cx="20" cy="20" r="15" fill={color} stroke="white" style={{ strokeWidth: '3' }} />
										</svg>
										<h2 id="profile-title">{login}</h2>
										<p className="status-text">{status}</p>
										<div className="row d-flex justify-content-center text-center" id="relations">
											{isFriend == false && pendingInvite == false && isBlocked == false ? <button type="button" className="btn btn-outline-success" id="invite--buton" onClick={inviteFriend}>Invite</button> : ""}
											{isFriend == false && pendingInvite == true && receivedInvitation == true && isBlocked == false ?
												<>
													<br />
													<br />
													<p className="profile_text">{login} wants to be your friend ! </p>
													<br />
												</>
												: ""}
											{isFriend == false && pendingInvite == true && receivedInvitation == true && isBlocked == false ?
												<>
													<button type="button" className="btn btn-outline-success" id="invite--buton" onClick={acceptFriend}>
														Accept
													</button>
													<button type="button" className="btn btn-outline-danger" id="invite--buton" onClick={declineFriend}>
														Decline
													</button>
												</>
												: ""}
											<div className="row d-flex justify-content-center text-center" id="relations">
												{isFriend == false && pendingInvite == true && sentInvitation == true && isBlocked == false ? <button type="button" className="btn btn-outline-info" id="invite--buton" disabled /*onClick={inviteFriend}*/>Sent Invitation</button> : ""}
											</div>
											{isFriend == false && pendingInvite == true && sentInvitation == true && isBlocked == false ?
												<>
													<p className="profile_text"> Waiting for {login} to answer to your invitation !</p>
													<br />
												</>
												: ""}
										</div>
										<div className="row d-flex justify-content-center text-center" id="friends--related">
											{isBlocked != true ? <button type="button" className="btn btn-outline-danger" id="block--buton" onClick={block}>Block</button> : ""}
											{isFriend == true ? <button type="button" className="btn btn-outline-danger" id="remove--buton" onClick={remove}>Remove</button> : ""}
										</div>
										<div className="row d-flex justify-content-center text-center" id="games--related">
											{isBlocked == true ?
												<>
													<br />
													<p className="block-warning">You blocked this user !</p>
													<button type="button" className="btn btn-outline-danger" id="unblock--buton" onClick={unblock}>Unblock</button>
												</>
												: ""}
											<br />
										</div>
										<div id="relationship">
										</div>
										<br />
										{isFriend == true ? <Achievement login={login} /> : ""}
										<br />
										{isFriend == true ? <MatchHistory login={login} /> : ""}
										<br />
										{isFriend == true ? <Badge
											rank={rank}
											level={level}
											login={login}
											total_wins={wins}
											total_loss={loss}
											total_games={totalGames}
											win_loss_ratio={ratio}
											xp={xp}
											points={points}
											to_next={nextlevel}
										/> : ""}
									</div>
									: <>
									</>
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
