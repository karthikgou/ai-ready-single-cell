// import leftNav from "../components/leftNav";
import TaskForm from "../components/MyData/formfortask";
import RightRail from "../components/RightNavigation/rightRail";

export default function CreateTask() {
    return(
        <div className="page-container">
            <div className="left-nav">
                {/* <LeftNav /> */}
            </div>
            <div className="main-content">
                <TaskForm/>
            </div>
            <div className="right-rail">
                <RightRail />
            </div>
        </div>
    )
}