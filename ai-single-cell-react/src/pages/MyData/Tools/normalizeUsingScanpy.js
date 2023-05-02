import { NormalizeUsingScanpyComponent } from "../../../components/MyData/Tools/normalizeWithScanpy"
import RightRail from "../../../components/RightNavigation/rightRail"

export default function NormalizeUsingScanpy() {
    return(
        <div className="page-container">
            <div className="left-nav">
            </div>
            <div className="main-content">
                <NormalizeUsingScanpyComponent />
            </div>
            <div className="right-rail">
                <RightRail />
            </div>
        </div>
    )
}