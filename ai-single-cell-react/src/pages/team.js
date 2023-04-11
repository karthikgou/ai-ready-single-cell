import RightRail from "../components/rightRail";
import { useState, useEffect } from 'react';
import axios from 'axios';
import LeftNav from "../components/leftNav";

const DIRECTUS_URL = `http://${process.env.REACT_APP_HOST_URL}:8055`

export default function Team() {

  const [coreTeamData, setCoreTeamData] = useState([]);
  const [committeeTeamData, setCommitteeTeamData] = useState([]);

  useEffect(() => {
    async function fetchTeamData() {
      const response = await axios.get(DIRECTUS_URL + "items/team");
      const teamMembers = response.data.data;
      const core_team = [];
      const steering_committee = [];
      for (const member of teamMembers) {
        member.imageUrl = DIRECTUS_URL + "assets/" + member.image;
        if(member.team_type === "core development") {
            core_team.push(member);
        } else if (member.team_type === "steering committee") {
            steering_committee.push(member);
        }
      }
      core_team.sort((a, b) => a.order - b.order);
      steering_committee.sort((a, b) => a.order - b.order);
      setCoreTeamData(core_team);
      setCommitteeTeamData(steering_committee)
    }
    fetchTeamData();
  }, []);


    return(
        <div className="page-container">
            <div className="left-nav border-r">
                {/* <LeftNav /> */}
            </div>
        

            <div className="main-content">
                <div className="team-page-container">
                    <h1>OSCB Team</h1>
                    <div className="team-content">
                        <h3>Core Development</h3>
                        <p>The core development team can be reached at <a href="/">oscb@cs.missouri.edu</a></p>
                    </div>

                    <div className="core-team-container">
                        {coreTeamData.map(member => (
                        <div className="member-card">
                            <img src={member.imageUrl} alt={`pic of ${member.firstname} ${member.lastname}`} className="img-responsive"></img>
                            <div className="member-details">
                                <p className="member-name span-class-link">{member.firstname} {member.lastname}</p>
                                <p className="member-organization">{member.organization}</p>
                            </div>
                        </div>
                        ))}
                    </div>

                    <hr/>

                <h3 className="steering-committee-header3">Steering Committe</h3>

                <div className="steering-team-container">
                        {committeeTeamData.map(member => (
                        <div className="member-card">
                            <img src={member.imageUrl} alt={`pic of ${member.firstname} ${member.lastname}`} className="img-responsive"></img>
                            <div className="member-details">
                                <p className="member-name span-class-link">{member.firstname} {member.lastname}</p>
                                <p className="member-organization">{member.organization}</p>
                            </div>
                        </div>
                        ))}
                    </div>
            </div>

            
            </div>
                <div className="right-rail">
                <RightRail />
            </div>
        </div>
    )
}