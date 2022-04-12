import './People.scss';
import Nav from '../Nav/Nav';
import Footer from "../Footer/Footer";
import All from "./All/All";
import Invitations from "./Invitations/Invitations";
import Friends from "./Friends/Friends";
import Blocked from "./Blocked/Blocked";

export interface PeopleProps {
	login?: string
}

export default function People(props: PeopleProps) {

	function update() {
		window.top.location = "/people/";
	}

	return (
		<>
			{localStorage.getItem("loggedIn") != "true" ?
				<>
					<Nav />
					<button onClick={update}>update</button>
					<div className="container">
						<div className="row d-flex justify-content-center text-center">
							<div className="col-9">
								<div className="channels-not-logged">
									<p>You are not logged in.</p>
								</div>
							</div>
						</div>
					</div>
				</>
				:
				<div id="people--div">
					<Nav />
					<div id="all">
						<div className="row">
							<br />
							<All />
							<br />
							<Friends />
							<br />
							<Invitations />
							<br />
							<Blocked />
						</div>
					</div>
				</div>
			}
		</>
	);
}
