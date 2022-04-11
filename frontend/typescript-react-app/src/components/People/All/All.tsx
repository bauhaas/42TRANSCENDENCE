import './All.scss';
import React, { Component, useState, useEffect, Suspense, lazy } from "react";
import myAxios from "../../Utils/Axios/Axios";
import axios from "axios";
import Invitations from "../Invitations/Invitations";
import Blocked from "../Blocked/Blocked";
import Friends from "../Friends/Friends";
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { Oval, Hearts } from "react-loader-spinner";

const MiniDisplay = lazy(() => import('../MiniDisplay/MiniDisplay'));

export interface InputWrapperProps {
	//children?: React.ReactNode | React.ReactChild | React.ReactChildren | React.ReactChild[] | React.ReactChildren[]
	//children?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}

export default function All(props: InputWrapperProps) {
	const [users, setUsers] = React.useState([]);
	const [load, setLoad] = React.useState(true);
	const [count, setCount] = useState(0);

	const calledOnce = React.useRef(false);

	async function renderUsers() {
		axios.defaults.withCredentials = true;
		let url = "http://localhost:3000/api/user/";
		await axios.get(url)
			.then(res => {
				console.log("Get api users successfully called.");
				let users = res.data;
				let len = users.length;
				let i = 0;
				while (i < len) {
					setUsers(prevArray => [...prevArray, users[i]])
					i++;
				}
			})
			.catch((error) => {
				console.log("Error while getting all users");
			})
		setLoad(true);
	}

	useEffect(() => {

		if (calledOnce.current) {
			return;
		}
		renderUsers();
		calledOnce.current = true;

	}, []);

	return (
		<div id="people--div">
			<div className="container" id="container--all">
				<br />
				<div className="row" id="row--users">
					<div id="ul--list" className="row">
						<h1 id="registered--title">List of all registered users</h1>
						<ul id="list--users--ul" className="wrapper list-group list-group-horizontal-lg">
							{load == true ?
								users.map(user =>
									<div key={user.login}>
										<Suspense fallback={<Hearts color="#ffe4e1" height={100} width={100} key={user.login} />}>
											<MiniDisplay key={user.login} login={user.login} status={user.status} avatar={user.avatar} ftlogin={user.login42} user={user} container="all" />
										</Suspense>
									</div>
								)
								: ""}
						</ul>
					</div>
				</div>
				<Friends />
				<Invitations />
				<Blocked />
			</div>
		</div>
	);
}
