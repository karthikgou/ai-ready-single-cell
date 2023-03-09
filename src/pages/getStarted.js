import { useState,useE, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import markdown from './markdown.md'
import LeftNav from "../components/leftNav";
import RightRail from "../components/rightRail";

export default function GetStarted() {
    const [markdownText,setMarkdownText] = useState('')

    useEffect(() => {
        fetch(markdown)
        .then((response) => response.text())
        .then((md) => {setMarkdownText(md)})
    },[])
    
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