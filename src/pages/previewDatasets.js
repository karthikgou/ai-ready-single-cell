import { Preview } from "../components/previewDatasets"
import RightRail from "../components/rightRail"
export default function PreviewDatasets() {
    return(
        <div className="page-container">
            <div className="left-nav">
            </div>
            <div className="main-content">
                <Preview />
            </div>
            <div className="right-rail">
                <RightRail />
            </div>
        </div>
    )
}