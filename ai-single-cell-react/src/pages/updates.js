import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftNav from "../components/leftNav";
import RightRail from "../components/rightRail";

const UPDATES_PAGE_API = `http://${process.env.REACT_APP_HOST_URL}:8055`

export default function Updates() {

    const [user,setUser] = useState([]);

    const fetchData = async () => {
        try {
          const response = await axios.get(UPDATES_PAGE_API + '/items/updates', {
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
          });
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      }

    useEffect(() => {
        fetchData();
    },[])
    
    function formatDate(date_given) {
        const months = ['January', 'February','March','April','May','June','July','August','September','October','November','December']
        const splitDate = date_given.split("/");
        const month = months[parseInt(splitDate[0])]
        const date  = splitDate[1]
        const year = splitDate[2]
        let formattedDate = month.concat(" ", date, ", ",year)
        return formattedDate;
    }

    return(
        <div className="updates-container">
            <div className="left-nav">
                <LeftNav />
            </div>

            <div className="main-content">
                <h1>Updates from OSGB</h1>
                <h2>{user[user.length-1].Title} - {formatDate(user[user.length-1].Date_published)}</h2>

                {user.reverse().map((item,index)=>(
                    <div>
                        <hr/>
                        <h4>{formatDate(item.Date_published)} : {item.Title}</h4>
                        <ul key={index}>
                            <li>{item.Description}</li>
                        </ul>
                    </div>

                ))}
            </div>
            
            <div className="right-rail">
                <RightRail />
            </div>
        </div>
    )
}