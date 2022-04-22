import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import React, { useState } from "react";
import ToastAlerts from '../../Utils/ToastAlerts/ToastAlerts';
import MyAxios from '../../Utils/Axios/Axios';
import "./CreateChan.scss";
import { ToastContainer } from 'react-toastify';

//TODO : a reprendre ?

export interface CreateChanProps {
	endpoint?: any,
	action?: any,
	handleshow?: any,
	setExited?: any,
	setUpdate?: any,
	exited?: any,
	setHasPass?: any
}
export default function CreateChan(props: CreateChanProps) {

	const [show, setShow] = React.useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [chanScope, chanScopeSet] = React.useState("public");
	const [chanName, chanNameSet] = React.useState("");
	const [chanPassword, chanPasswordSet] = React.useState("");
	//const [isFree, setIsFree] = React.useState("false");
	const [sucessfull, setSuccessfull] = React.useState(false);
	const [load, setLoad] = React.useState(false);

	const handleExit = () => {
		let toast = new ToastAlerts(null);

		console.log("it is successfull ? " + sucessfull);
		if (sucessfull == true) {
			//toast.notifySuccess("Successfully added");
			console.log("result will be " + !props.exited);
			//redirection crade pour recharger la page
			//window.top.location = "http://localhost:3030/channels";
			props.setExited(!props.exited);
		}
		else {

			//toast.notifyDanger("Unsucessfull add");
			console.log("Did not add anything")
			//props.setExited(!props.exited);
			//props.setUpdate(chanName);//pour trigger un update
		}
		//props.setUpdate(chanName);
		chanNameSet("");
		chanScopeSet("public");
		chanPasswordSet("");
	}

	const handleSend = () => {
		//console.log("Creating channel");
		axios.defaults.withCredentials = true;

		//Check si la channel existe ou pas
		let url = "http://localhost:3000/api/chat/".concat(chanName).concat("/exist");

		let toast = new ToastAlerts(null);

		let load = false;
		let isFree = false;
		axios.get(url)
			.then(res => {
				console.log(res);//si existe renvoie faux
				console.log(res.data);
				console.log(typeof res.data);
				isFree = res.data;
				load = true;

				if (isFree == false) {
					toast.notifyDanger("This channel already exists.");
					//handleClose();
					return;
				}

				axios.defaults.withCredentials = true;

				let headers = {
					'Content-Type': 'application/json'
				}

				let body = {};

				if (res.data == true || res.data == "true") {
					//setIsFree("true");
					//Ca ne rentre pas dans cette putin de condition
					if (isFree == true && load == true) {
						//console.log("creating channel");
						url = "http://localhost:3000/api/chat/new";

						let scope: boolean;
						if (chanScope === "public")
							scope = true;
						else
							scope = false;
						if (chanPassword.length <= 0) {
							console.log("body without pass");
							body = {
								public: scope,
								name: chanName
							}
						}
						else {
							console.log("body with pass:" + chanPassword);
							props.setHasPass(true);
							body = {
								password: chanPassword,
								public: scope,
								name: chanName
							}
						}

						axios.post(url, body)
							.then(res => {
								console.log("successfully created a chat !");
								setSuccessfull(true);
								toast.notifySuccess("✨ Successfully created channel !");
								handleClose();
							})
							.catch((error) => {
								console.log("Catched error on post api chat. :(");
								console.log(error);
							})
					}
				}
			})
	}

	return (
		<div id="create-chan_div">
			<button type="button" className="btn btn-success"
				id="createchan-button" /*onClick={createJoinChan}*/
				onClick={handleShow}
				data-toggle="modal" data-target="#exampleModalCenter"
			>New channel</button>
			<Modal show={show} animation={true} onHide={handleClose} onExited={handleExit}>
				<Modal.Header closeButton>
					<Modal.Title id="create_title">Create a channel 💌</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="channName">
							<Form.Label>Channel name</Form.Label>
							<Form.Control
								type="text"
								value={chanName}
								onChange={e => { chanNameSet(e.target.value) }}
								autoFocus
								placeholder="my_unique_chanName"
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Choose policy</Form.Label>
							<Form.Select aria-label="Channel visibility" onChange={e => chanScopeSet(e.target.value)} defaultValue="public">
								<option value="public">public</option>
								<option value="private">private</option>
							</Form.Select>
						</Form.Group>
						<Form.Group className="mb-3" controlId="channPassword">
							<Form.Label>Channel password</Form.Label>
							<Form.Control
								type="password"
								value={chanPassword}
								onChange={e => { chanPasswordSet(e.target.value) }}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="ligth" onClick={handleClose}>
						Close
					</Button>
					<Button variant="dark" type="submit" onClick={handleSend}>
						Send form
					</Button>
				</Modal.Footer>
			</Modal>
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
	);

}
