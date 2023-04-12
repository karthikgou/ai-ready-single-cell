import UserRouting from "../../components/userRouting";

export default function RoutingTemplate() {
    return(
        <div className="page-container">
            <div className="left-nav">
                {/* <LeftNav /> */}
            </div>
            <div className="main-content">
                <UserRouting />
            </div>
            <div className="right-rail">
                {/* <RightRail /> */}
            </div>
        </div>
    )
}