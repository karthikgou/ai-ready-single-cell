import LoginPage from "../../components/logIn";

export default function Login(props) {
    return(
        <div className="page-container">
            <div className="left-nav">
                {/* <LeftNav /> */}
            </div>
            <div>
                <LoginPage />
            </div>
            <div className="right-rail">
                {/* <RightRail /> */}
            </div>
        </div>
    )
}