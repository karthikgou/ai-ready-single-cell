import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowRightArrowLeft , faPlus, faCaretDown, faPen, faDatabase, faLocationDot, faArrowsRotate, faSquareCheck, faCompress, faGear, faChevronDown, faCross, faXmark, faAngleDoubleDown} from "@fortawesome/free-solid-svg-icons";
import SearchBox from "./searchBar";

function RightRail() {
  return (
    <div className="right-container border-l border-gray-100">
        <div className="search-window border-b">
            <div className="row1-search-window rows-search-window">
                <div className="left-side-of-container">
                    <span className="text-gray-400"><b>History</b></span>
                </div>
                <div className="right-side-of-container">
                    <FontAwesomeIcon icon={faPlus} />
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                    <FontAwesomeIcon icon={faCaretDown} />
                </div>
            </div>
            <div className="row2-search-window rows-search-window">
                {/* <SearchBox /> */}
                <input
                    type="text"
                    placeholder="Search Datasets..."
                    className="w-full dark:bg-gray-950 pl-8 form-input-alt h-9 pr-3 focus:shadow-xl"
                />
                <FontAwesomeIcon className="right-rail-search-svg" icon={faAngleDoubleDown} />
                <FontAwesomeIcon className="right-rail-search-svg" icon={faXmark} />
            </div>
            <div className="row3-search-window rows-search-window">
                <div className="left-side-of-container">
                    <span className="text-gray-400"><b>Unnamed history</b></span>
                </div>
               <div className="right-side-of-container">
                    <FontAwesomeIcon icon={faPen} />
               </div>
            </div>
            <div className="row4-search-window rows-search-window">
                <div className="left-side-of-container">
                    <FontAwesomeIcon icon={faDatabase} /><span className="text-gray-400">120 B</span>
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
