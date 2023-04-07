import LeftNav from "../components/leftNav";
import RightRail from "../components/rightRail";
import StorageChart from "../components/storageChart";

export default function MyData() {
    return(
        <div className="page-container">
            <div className="left-nav">
                <LeftNav />
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