import {Outlet, NavLink} from "react-router-dom"
import Authentication from "../components/AuthForm";
import SearchBox from "../components/searchBar"
import React, { useState } from "react";
export default function RootLayout() {

    const [isLoginReq, setIsLoginReq] = useState(false);

    const handleAuth = (event) => {
        event.preventDefault();
        setIsLoginReq(!isLoginReq);
    };
    const [hoveredChildIndex, setHoveredChildIndex] = useState(null);


    const handleMouseOver = (event) => {
      setHoveredChildIndex(parseInt(event.currentTarget.dataset.index));
    };
  
    const handleMouseOut = () => {
      setHoveredChildIndex(null);
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
                                <li data-index="0" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}><NavLink to="getStarted">Get Started</NavLink>
                                    <div className={hoveredChildIndex === 0 ? "suboptions-container" : "suboptions-container hide"}>
                                        <ul className="ul-suboptions">
                                            <li><NavLink to="getStarted/benchmarks">Benchmarks</NavLink></li>
                                            <li><NavLink to="getStarted/mydata">My Data</NavLink></li>
                                        </ul>
                                    </div>
                                </li>
                                <li data-index="1"><NavLink to="updates">Updates</NavLink></li>
                                <li data-index="2"><NavLink to="competitions">Competitions</NavLink></li>
                                <li data-index="3" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}><NavLink to="benchmarks">Benchmarks</NavLink>
                                    <div className={hoveredChildIndex === 3 ? "suboptions-container" : "suboptions-container hide"}>
                                        <ul className="ul-suboptions">
                                            <li><NavLink to="benchmarks/overview">Overview</NavLink></li>
                                            <li><NavLink to="benchmarks/clustering">Clustering</NavLink></li>
                                            <li><NavLink to="benchmarks/imputation">Imputation</NavLink></li>
                                            <li><NavLink to="benchmarks/maker-gene-identification">Marker Gene Identification</NavLink></li>
                                            <li><NavLink to="benchmarks/trajectory">Trajectory</NavLink></li>
                                            <li><NavLink to="benchmarks/cell-cell-communication">Cell-Cell Communication</NavLink></li>
                                            <li><NavLink to="benchmarks/multiomics-data-integration">Multiomics Data Integration</NavLink></li>
                                            <li><NavLink to="benchmarks/gene-regulatory-relations">Gene Regulatory Relations</NavLink></li>
                                            <li><NavLink to="benchmarks/genes-over-time">Genes Over Time</NavLink></li>
                                            <li><NavLink to="benchmarks/genes-over-condition">Genes Over Condition</NavLink></li>
                                            <li><NavLink to="benchmarks/cell-type">Cell Type</NavLink></li>
                                        </ul>
                                    </div>
                                </li>
                                <li data-index="4" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}><NavLink to="leaderboards">Leaderboards</NavLink>
                                    <div className={hoveredChildIndex === 4 ? "suboptions-container" : "suboptions-container hide"}>
                                        <ul className="ul-suboptions">
                                            <li><NavLink to="leaderboards/overview">Overview</NavLink></li>
                                            <li><NavLink to="leaderboards/clustering">Clustering</NavLink></li>
                                            <li><NavLink to="leaderboards/imputation">Imputation</NavLink></li>
                                            <li><NavLink to="leaderboards/maker-gene-identification">Marker Gene Identification</NavLink></li>
                                            <li><NavLink to="leaderboards/trajectory">Trajectory</NavLink></li>
                                            <li><NavLink to="leaderboards/cell-cell-communication">Cell-Cell Communication</NavLink></li>
                                            <li><NavLink to="leaderboards/multiomics-data-integration">Multiomics Data Integration</NavLink></li>
                                            <li><NavLink to="leaderboards/gene-regulatory-relations">Gene Regulatory Relations</NavLink></li>
                                            <li><NavLink to="leaderboards/genes-over-time">Genes Over Time</NavLink></li>
                                            <li><NavLink to="leaderboards/genes-over-condition">Genes Over Condition</NavLink></li>
                                            <li><NavLink to="leaderboards/cell-type">Cell Type</NavLink></li>
                                        </ul>
                                    </div>
                                </li>
                                <li data-index="5" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}><NavLink to="mydata">My Data</NavLink>
                                    <div className={hoveredChildIndex === 5 ? "suboptions-container" : "suboptions-container hide"}>
                                        <ul className="ul-suboptions">
                                            <li><NavLink to="mydata/upload-data">Upload Data</NavLink></li>
                                            <li><NavLink to="mydata/workflows">Workflows</NavLink></li>
                                            <li><NavLink to="mydata/tools">Tools</NavLink></li>
                                        </ul>
                                    </div>
                                </li>
                                <li data-index="6" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}><NavLink to="docs">Docs</NavLink>
                                    <div className={hoveredChildIndex === 6 ? "suboptions-container" : "suboptions-container hide"}>
                                        <ul className="ul-suboptions">
                                            <li><NavLink to="docs/paper">Paper</NavLink></li>
                                            <li><NavLink to="docs/tutorial">Tutorial</NavLink></li>
                                        </ul>
                                    </div>
                                </li>
                                <li data-index="7"><NavLink to="team">Team</NavLink></li>
                                <li data-index="8" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}><NavLink to="login" onClick={handleAuth}>Log In | Sign Up</NavLink>
                                    <div className={hoveredChildIndex === 8 ? "suboptions-container" : "suboptions-container hide"}>
                                        <ul className="ul-suboptions">
                                            <li><NavLink to="login/my-projects">My Projects</NavLink></li>
                                            <li><NavLink to="login/my-data">My Data</NavLink></li>
                                            <li><NavLink to="login/reports">Reports</NavLink></li>
                                            <li><NavLink to="login/security">Security</NavLink></li>
                                            <li><NavLink to="login/log-out">Log Out</NavLink></li>

                                        </ul>
                                    </div>
                                </li>
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