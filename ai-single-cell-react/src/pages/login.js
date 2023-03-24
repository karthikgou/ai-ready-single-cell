import LeftNav from "../components/leftNav";
import RightRail from "../components/rightRail";

export default function Login() {
    return(
        <div className="page-container">
            <div className="left-nav">
                <LeftNav />
            </div>
            <div className="main-content">
                <h1>I'm inside login page</h1>
            </div>
            <div className="right-rail">
                <RightRail />
            </div>
        </div>
    )
}