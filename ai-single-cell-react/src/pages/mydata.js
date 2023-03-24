import LeftNav from "../components/leftNav";
import RightRail from "../components/rightRail";
import UploadData from "../components/uploadData";
import UppyUploader from "../components/uppy";

export default function MyData() {
    return (
        <div className="page-container">
            <div className="left-nav">
                <LeftNav />
            </div>
            <div className="main-content">
                <UploadData />
            </div>
            <div className="right-rail">
                <RightRail />
            </div>
        </div>
    )
}