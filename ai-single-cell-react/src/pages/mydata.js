// import LeftNav from "../components/leftNav";
import RightRail from "../components/rightRail";
import StorageChart from "../components/storageChart";
import { getCookie } from "../utils/utilFunctions";
import { useNavigate } from 'react-router-dom';

export default function MyData() {

    const navigate = useNavigate();
    let jwtToken = getCookie('jwtToken');

    if(jwtToken===undefined || jwtToken === '') {
        navigate('/routing');
    }

    else return(
        <div className="page-container">
            <div className="left-nav">
                {/* <LeftNav /> */}
            </div>
            <div className="main-content">
            <StorageChart/>
            </div>
            <div className="right-rail">
                <RightRail />
            </div>
        </div>
    )
}