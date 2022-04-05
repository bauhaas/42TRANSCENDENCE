import './CreateChan.scss';
import React, {Component, useState, useEffect} from "react";
import Nav from "../../Nav/Nav";
import {Modal, Button, Row, Col, Form} from "react-bootstrap";
import CreateChanModal from "../../Utils/Modal/Modal";
import myAxios from "../../Utils/Axios/Axios";
import axios from "axios";
import ListChannels from "../ListChannels/ListChannels";
import Channels from "../../Channels/Channels";

interface UserChat
{
	login?: string
}

export default function CreateChan(props: UserChat)
{
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <div id="channels">
            <Nav />
            <div className="container">
                <div className="row d-flex justify-content-center text-center">
                    <div className="col-7">
                        <div id="quick--actions">
                            <h1 className="text">Quick actions</h1>
                            <br />
                            <div className="row">
                                <Button className="quick--actions" variant="primary" disabled >
                                    Create a new channel
                                </Button>
                                {/*<Button className="quick--actions" variant="light" disabled>
                                    Send a DM
                                </Button>
                                <Button className="quick--actions" variant="light" disabled>
                                    Answer invitation(s)
                                </Button>
                                <Button className="quick--actions" variant="light" disabled>
                                    Invite friend
                                </Button>
                                <Button className="quick--actions" variant="light" disabled>
                                    Make admin
                                </Button>
                                <Button className="quick--actions" variant="light" disabled>
                                    Mute
                                </Button>
                                <Button className="quick--actions" variant="light" disabled>
                                    Invite to play
                                </Button>
                                <Button className="quick--actions" variant="light" disabled>
                                    Answer to play
                                </Button>*/}
                            </div>
                            <CreateChanModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            />
                        </div>
                        </div>
                    </div>
                </div>
                <ListChannels />
            </div>
        );
    }
