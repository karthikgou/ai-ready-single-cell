import LeftNav from "../components/leftNav";
import RightRail from "../components/rightRail";

export default function Team() {
    return(
        <div className="page-container">
            <div className="left-nav">
                <LeftNav />
            </div>
            <div className="main-content">
                <h1>I'm inside Team page</h1>
            </div>
            <div className="right-rail">
                <RightRail />
            </div>
        </div>
    )
}