import './Achievements.scss';
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import React, { useEffect } from "react";

//icons
import { MdLocalFireDepartment } from "react-icons/md";
import { FaCat, FaUserFriends } from "react-icons/fa";
import { GiPowerButton, GiPeaceDove } from "react-icons/gi";
import { GrGamepad } from "react-icons/gr";
import { BsCheckLg } from "react-icons/bs";
//endof icons

import axios from 'axios';
import MyAxios from "../Utils/Axios/Axios";

export interface AchievementsProps {
    login?: string,
    children?: React.ReactNode | React.ReactChild | React.ReactChildren | React.ReactChild[] | React.ReactChildren[]
}

export default function Achievement(props: AchievementsProps) {

    const [myArray, setMyArray] = React.useState([]);

    async function getAchievements() {
        //demander a MAhaut pq cette methode marche pas
        //let ax = new MyAxios(null);
        //let arr = ax.get_api_achievements();
        //setMyArray(arr);

        let url = "http://localhost:3000/api/user/achievements/me";

        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        axios.defaults.withCredentials = true;

        axios.get(url)
            .then(res => {
                console.log("Successfully retrieve achievements");
                console.log(res.data);
                setMyArray(res.data.map(element => element.title))

            })
            .catch((error) => {
                console.log("Error while retrieve achievements");
                console.log(error);
            })
    }

    function CheckMark() {
        return <svg className="checkmark"><BsCheckLg /></svg>;
    }

    function isUnlocked(name: string) {
        if (myArray.find(element => element == name))
            return true;
        return false;
    }

    useEffect(() => {
        getAchievements()
    }, []);

    //render() {
    return (
        <div id="Leaderboard">
            <Nav />
            <div id="achievements">
                <div className="container">
                    <div className="row d-flex justify-content-center text-center" id="row-cards">
                        <h1 id="achievements--title">Achievements</h1>
                    </div>
                    <div className="row" id="first-row">
                        <div className="card-group" id="group--one">
                            <div className="card" >
                                <div className={isUnlocked("BeAdmin") ? "card--unlocked" : "card--locked"}>
                                    {isUnlocked("BeAdmin") ? <CheckMark /> : ""}
                                    <div className="card-body">
                                        <h5 className="card-title">Let's negotiate</h5>
                                        <p className="card-text">Be admin of a channel</p>
                                        <svg className="test-icon">{<GiPeaceDove />}</svg>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className={isUnlocked("5Row") ? "card--unlocked" : "card--locked"}>
                                    {isUnlocked("5Row") ? <CheckMark /> : ""}
                                    <div className="card-body">
                                        <h5 className="card-title">On fire</h5>
                                        <p className="card-text">Win 5 games in a row</p>
                                        <svg className="test-icon">{<MdLocalFireDepartment />}</svg>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className={isUnlocked("1000Game") ? "card--unlocked" : "card--locked"}></div>
                                {isUnlocked("1000Game") ? <CheckMark /> : ""}
                                <div className="card-body">
                                    <h5 className="card-title">I'm a g4m3r</h5>
                                    <p className="card-text">Play 1000 games</p>
                                    <svg className="test-icon">{<GrGamepad />}</svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row" id="second-row">
                        <div className="card-group">
                            <div className="card">
                                <div className={isUnlocked("AddFriend") ? "card--unlocked" : "card--locked"}>
                                    {isUnlocked("AddFriend") ? <CheckMark /> : ""}
                                    <div className="card-body">
                                        <h5 className="card-title">This is how I met</h5>
                                        <p className="card-text">Have one friend</p>
                                        <svg className="test-icon">{<FaUserFriends />}</svg>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className={isUnlocked("FirstGame") ? "card--unlocked" : "card--locked"}>
                                    {isUnlocked("FirstGame") ? <CheckMark /> : ""}
                                    <div className="card-body">
                                        <h5 className="card-title">I am not a noob</h5>
                                        <p className="card-text">Launch your first game</p>
                                        <svg className="test-icon">{<GiPowerButton />}</svg>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className={isUnlocked("42") ? "card--unlocked" : "card--locked"}>
                                    {isUnlocked("42") ? <CheckMark /> : ""}
                                    <div className="card-body">
                                        <h5 className="card-title">42</h5>
                                        <p className="card-text">????????????????</p>
                                        <svg className="test-icon">{<FaCat />}</svg>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div >
    );
}