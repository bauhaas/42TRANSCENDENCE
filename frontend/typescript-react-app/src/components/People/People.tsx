import './People.scss';
import Nav from '../Nav/Nav';
import Footer from "../Footer/Footer";
import All from "./All/All";
import Invitations from "./Invitations/Invitations";
import Friends from "./Friends/Friends";

/**
 * @malatini
 */
export default function People() {
    return (
        <div id="people--div">
            <Nav />
            {/*<div className="container">*/}
                {/*<div className="d-flex justify-content-center text-center">*/}
					{/*<div id="people">
						<div className="row">
							<h1 className="text">People</h1>
							<p className="text">Lorem</p>
						</div>
					</div>
					<br/>*/}
					{/*<div id="friends">
						<div className="row">
							<h2 className="text" id="friends-title">Friends</h2>
							<p className="text">Lorem</p>
							<br />
						</div>*/}
				{/*</div>*/}
				{/*<div className="d-flex justify-content-center text-center">*/}
					<div id="all">
						<div className="row">
							<All />
							<br />
							<Invitations />
							<br />
							<Friends />
						</div>
					</div>
                {/*</div>*/}
			{/*//</div>*/}
        {/*</div>*/}
        </div>
    );
}