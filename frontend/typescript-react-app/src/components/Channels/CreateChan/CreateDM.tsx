import {Button, Modal, Form} from 'react-bootstrap';
import axios from 'axios';
import React, {useState} from "react";
import ToastAlerts from '../../Utils/ToastAlerts/ToastAlerts';
import MyAxios from '../../Utils/Axios/Axios';
import "./CreateDM.scss";

export interface CreateDMProps {
	endpoint?: any,
	action?: any
	handleshow?: any,
	setExited?: any,
	setUpdate?: any,
	exited?: any
}
export default function CreateDM(props: CreateDMProps) {

	const [show, setShow] = React.useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	//const [chanScope, chanScopeSet] = React.useState("public");
	const [chanName, chanNameSet] = React.useState("");
	const [receiver, setReceiver] = React.useState("");
	const [sucessfull, setSuccessfull] = React.useState(false);
	const [load, setLoad] = React.useState(false);

	const handleExit = () => {
		let toast = new ToastAlerts(null);

		console.log("it is successfull ? " + sucessfull);
		if (sucessfull == true)
		{
			//toast.notifySuccess("Successfully added");
			console.log("result will be " + !props.exited);
			//redirection crade pour recharger la page
			//window.top.location = "http://localhost:3030/channels";
			props.setExited(!props.exited);
		}
		else
		{

			//toast.notifyDanger("Unsucessfull add");
			console.log("Did not add anything")
			//props.setExited(!props.exited);
			//props.setUpdate(chanName);//pour trigger un update
		}
		chanNameSet("");
		setReceiver("");
	}

	const createDM = () => {

		console.log("Creating DM !");

		let toast = new ToastAlerts(null);
		//let ax = new MyAxios(null);

		let url = "http://localhost:3000/api/chat/".concat(receiver).concat("/direct");

		let res = axios.post(url)
					.then(res => {
						console.log("successfully created DM conv !");
						setSuccessfull(true);
						toast.notifySuccess("🥰 Successfully created DM conv!");
					})
					.catch((error) => {
						console.log("Catched error while creating DM conv");
						toast.notifyDanger("😢 Error while creating DM conv. Login or channel name may be wrong.");
						console.log(error);
						setSuccessfull(false);
					})

		//return ;
	}

	return (
		<div>
			<button type="button" className="btn btn-dark"
							id="createdm-button" /*onClick={createJoinChan}*/
							onClick={handleShow}
							//data-toggle="modal" data-target="#exampleModalCenter"
						>New DM</button>
			<Modal show={show} onHide={handleClose} animation={true} onExited={handleExit}>
				<Modal.Header closeButton>
					<Modal.Title>Create DM conversation 💌</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						{/* A reprendre */}
						{/*<Form.Group className="mb-3" controlId="channName">
							<Form.Label>Conversation title</Form.Label>
							<Form.Control
								type="text"
								value={chanName}
								onChange={e => {chanNameSet(e.target.value)}}
								autoFocus
								placeholder="my_unique_chanName"
							/>
						</Form.Group>*/}
						<Form.Group className="mb-3" controlId="channPassword">
							<Form.Label>Receiver</Form.Label>
							<Form.Control
								type="text"
								value={receiver}
								placeholder="bahaas"
								onChange={e => {setReceiver(e.target.value)}}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="ligth" onClick={handleClose}>
						Close
					</Button>
					<Button variant="dark" type="submit" onClick={createDM}>
						Send form
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
