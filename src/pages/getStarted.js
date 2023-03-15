import { useState, useEffect } from "react"
import axios from 'axios';
import ReactMarkdown from "react-markdown"
import LeftNav from "../components/leftNav";
import RightRail from "../components/rightRail";

const DIRECTUS_URL = "http://localhost:8055/"


export default function GetStarted() {
    const [markdownText,setMarkdownText] = useState('')

    useEffect(() => {
        async function fetchFileData() {
        try {
            const response = await axios.get(DIRECTUS_URL + "items/filemappings?filter[filename]=getstarted");
            const data = response.data.data;
            
            if(data.length === 1) {
                const fileMappingObject = data[0];
                const fileID = fileMappingObject.fileID;
                if(fileID !== null) {
                    fetch(DIRECTUS_URL + "assets/" + fileID)
                    .then(response => response.text())
                    .then(data => setMarkdownText(data))
                    .catch(error => console.error('Error retrieving markdown:', error));
                }
            }
            
          } catch (error) {
            console.error('Error retrieving data:', error);
          }
        }
        
        fetchFileData();
      }, []);
    
    return(
        
        <div className="getStarted-container">

            <div className="left-nav">
                <LeftNav />
            </div>

            <div className="main-content">
                <ReactMarkdown children={markdownText}/>
            </div>

            <div className="right-rail">
                <RightRail />
            </div>            
            
        </div>
    )
}