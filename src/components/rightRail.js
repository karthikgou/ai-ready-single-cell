import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowRightArrowLeft , faPlus, faCaretDown, faPen, faDatabase, faLocationDot, faArrowsRotate, faSquareCheck, faCompress, faGear} from "@fortawesome/free-solid-svg-icons";
import SearchBox from "./searchBar";

function RightRail() {
  return (
    <div className="right-container">
        <div className="search-window">
            <div className="row1-search-window">
                <h3>History</h3>
                <FontAwesomeIcon icon={faPlus} />
                <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                <FontAwesomeIcon icon={faCaretDown} />
            </div>
            <div className="row2-search-window">
                <SearchBox />
            </div>
            <div className="row3-search-window">
               <h3>Unnamed history</h3>
               <FontAwesomeIcon icon={faPen} />

            </div>
            <div className="row4-search-window">
                 <FontAwesomeIcon icon={faDatabase} /><span>120 B</span>
                 <FontAwesomeIcon icon={faLocationDot} />
                 <FontAwesomeIcon icon={faArrowsRotate} />
            </div>
            <div className="row5-search-window">
                 <FontAwesomeIcon icon={faSquareCheck} />
                 <FontAwesomeIcon icon={faCompress} />
                 <FontAwesomeIcon icon={faGear} />
            </div>

        </div>
        <div className="results-window">

        </div>
    </div>
  );
}

export default RightRail;
