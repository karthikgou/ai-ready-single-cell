import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowRightArrowLeft , faPlus, faCaretDown, faPen, faDatabase, faLocationDot, faArrowsRotate, faSquareCheck, faCompress, faGear} from "@fortawesome/free-solid-svg-icons";
import SearchBox from "./searchBar";

function RightRail() {
  return (
    <div className="right-container">
        <div className="search-window">
            <div className="row1-search-window rows-search-window">
                <div className="left-side-of-container">
                    <span><b>History</b></span>
                </div>
                <div className="right-side-of-container">
                    <FontAwesomeIcon icon={faPlus} />
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                    <FontAwesomeIcon icon={faCaretDown} />
                </div>
            </div>
            <div className="row2-search-window rows-search-window">
                <SearchBox />
            </div>
            <div className="row3-search-window rows-search-window">
                <div className="left-side-of-container">
                    <span><b>Unnamed history</b></span>
                </div>
               <div className="right-side-of-container">
                    <FontAwesomeIcon icon={faPen} />
               </div>
            </div>
            <div className="row4-search-window rows-search-window">
                <div className="left-side-of-container">
                    <FontAwesomeIcon icon={faDatabase} /><span>120 B</span>
                 </div>
                 <div className="right-side-of-container">
                    <FontAwesomeIcon icon={faLocationDot} />
                    <FontAwesomeIcon icon={faArrowsRotate} />
                 </div>
            </div>
            <div className="row5-search-window rows-search-window">
                <div className="left-side-of-container">
                    <FontAwesomeIcon icon={faSquareCheck} />
                    <FontAwesomeIcon icon={faCompress} />
                 </div>
                 <div className="right-side-of-container">
                    <FontAwesomeIcon icon={faGear} />
                 </div>
            </div>

        </div>
        <div className="results-window">

        </div>
    </div>
  );
}

export default RightRail;
