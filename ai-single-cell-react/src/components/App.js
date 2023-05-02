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
import MyData from './../pages/mydata'
import Team from './../pages/team'
import Docs from './../pages/docs'
import PreviewDatasets from './../pages/previewDatasets'
import UploadData from './uploadData';
import LoginPage from '../pages/login/login';
import Signup from '../pages/login/signup';
import RoutingTemplate from '../pages/login/loginRouting';

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
          <Route path="team"         element={<Team/>}/>
          <Route path="docs"         element={<Docs/>}/>
          <Route path="login"         element={<LoginPage/>}/>
          <Route path="signup"         element={<Signup/>}/>
          <Route path="routing"         element={<RoutingTemplate/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
