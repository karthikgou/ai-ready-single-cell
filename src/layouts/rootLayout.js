import {Outlet, NavLink} from "react-router-dom"
import Authentication from "../components/AuthForm";
import SearchBox from "../components/searchBar"
import React, { useState } from "react";
export default function RootLayout() {

    const [isLoginReq, setIsLoginReq] = useState(false);
    // const [authType, setAuthType] = useState("logIn");
    // let component;

    const handleAuth = (event) => {
        event.preventDefault();
        setIsLoginReq(!isLoginReq);
    };

    return(
        <div className="container">
            <div className="auth-form-container">
                <Authentication isLoginReq={isLoginReq} handleAuth={handleAuth}/>
            </div>
            <div className ="header-container">
                <header>
                    <h1>OSCB</h1>
                    <div className="header-left">
                        <SearchBox />
                    </div>
                    <div className="header-right">
                        <nav>
                            <ul>
                                <li><NavLink to="getStarted">Get Started</NavLink></li>
                                <li><NavLink to="updates">Updates</NavLink></li>
                                <li><NavLink to="competitions">Competitions</NavLink></li>
                                <li><NavLink to="benchmarks">Benchmarks</NavLink></li>
                                <li><NavLink to="leaderboards">Leaderboards</NavLink></li>
                                <li><NavLink to="mydata">My Data</NavLink></li>
                                <li><NavLink to="docs">Docs</NavLink></li>
                                <li><NavLink to="team">Team</NavLink></li>
                                <li><NavLink to="login" onClick={handleAuth}>Log In | Sign Up</NavLink></li>
                            </ul>
                        </nav>
                    </div>
                </header>
            </div>
            <div className="main-container">
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}