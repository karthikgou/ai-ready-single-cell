import './App.css';
import {
  BrowserRouter,
  Route, 
  Routes
} from 'react-router-dom'


// import Layouts
import RootLayout from './../layouts/rootLayout'

// import Pages
import GetStarted from './../pages/getStarted'
import Competitions from './../pages/competitions'
import Updates from './../pages/updates'
import Benchmarks from './../pages/benchmarks'
import Leaderboards from './../pages/leaderboards'
import MyData from '../pages/MyData/mydata'
import Team from './../pages/team'
import Docs from './../pages/docs'
import PreviewDatasets from '../pages/MyData/previewDatasets'
import UploadData from './MyData/uploadData';
import Login from '../pages/Login/login';
import SignUp from '../pages/Login/signup';
import RoutingTemplate from '../pages/Login/loginRouting';
import ClusteringUsingRaceID from '../pages/MyData/Workflows/ClusteringUsingRaceID';
import NormalizeUsingScanpy from '../pages/MyData/Tools/normalizeUsingScanpy';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path='getStarted'   element={<GetStarted/>} />
          <Route path="updates"      element={<Updates/>} />
          <Route path="competitions" element={<Competitions/>}/>
          <Route path="benchmarks"   element={<Benchmarks/>}/>
          <Route path="leaderboards" element={<Leaderboards/>}/>
          <Route path="mydata"       element={<MyData/>}></Route>
          <Route path="mydata/upload-data"       element={<UploadData/>}></Route>
          <Route path="mydata/update-dataset"       element={<UploadData/>}></Route>
          <Route path="mydata/preview-datasets" element={<PreviewDatasets/>}></Route>
          <Route path="mydata/workflows" element={<ClusteringUsingRaceID/>}></Route>
          <Route path="mydata/tools" element={<NormalizeUsingScanpy/>}></Route>
          <Route path="team"         element={<Team/>}/>
          <Route path="docs"         element={<Docs/>}/>
          <Route path="login"         element={<Login/>}/>
          <Route path="signup"         element={<SignUp/>}/>
          <Route path="routing"         element={<RoutingTemplate/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
