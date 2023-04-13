import React, { useState, useEffect } from 'react';
import {
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';
import { getCookie, isUserAuth } from '../utils/utilFunctions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const FLASK_PREVIEW_DATASET_API = `http://${process.env.REACT_APP_HOST_URL}:5000`;
const PREVIEW_DATASETS_API = `http://${process.env.REACT_APP_HOST_URL}:3001`;

export function Preview(props) {

  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState('');
  const [loadedPanels, setLoadedPanels] = useState([]);
  const [expandedPanels, setExpandedPanels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedHtmlContent, setLoadedHtmlContent] = useState({});
  let jwtToken = getCookie('jwtToken');
  const [datasets, setDatasets] = useState([]);
  let { message } = props;
  const [hasMessage, setHasMessage] = useState(message !== '' && message !== undefined);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      message = '';
      setHasMessage(false);
    }, 5000);
    // Return a cleanup function to cancel the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, [message]);

  const handlePanelExpanded = (path, files) => {
    if (!loadedPanels.includes(path)) {
      setIsLoading(true);

      // Check if the htmlContent for this path has already been loaded
      if (loadedHtmlContent[path]) {
        // If it has, set the htmlContent from state and expand the panel
        setHtmlContent(loadedHtmlContent[path]);
        setExpandedPanels(prev => [...prev, { path, expanded: true }]);
        setIsLoading(false);
      } else {
        // If it hasn't, make a call to the Flask API to get the HTML content

        // If user is not logged In - navigate to login page
        if(jwtToken === null || jwtToken === undefined || jwtToken === '') {
          navigate("/routing");
        }

        // Else verify the authenticity of the user
        isUserAuth(jwtToken)
        .then((authData) => {
          if (authData.isAuth) {
            fetch(FLASK_PREVIEW_DATASET_API + '/preview/dataset', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ path: path, files: files, username:authData.username}),
            })
            .then(response => response.text())
            .then(data => {
              setHtmlContent(data);
              setLoadedHtmlContent(prev => ({ ...prev, [path]: data }));
              setIsLoading(false);
              setExpandedPanels(prev => [...prev, { path, expanded: true }]);
            });
          } else {
            console.warn("Unauthorized - pLease login first to continue");
            navigate("/routing");
          }
        })
        .catch((error) => console.error(error));
      }
      setLoadedPanels(prev => [...prev, path]);
    } else {
      setExpandedPanels(prev => prev.map(p => p.path === path ? { ...p, expanded: !p.expanded } : p));
    }
  };

  useEffect(() => {
    if(jwtToken) {
      const fetchData = async () => {
        const response = await axios.get(PREVIEW_DATASETS_API + "/preview/datasets?authToken=" + jwtToken);
        setDatasets(Object.values(response.data));
      };
      fetchData();
    } else {
      navigate("/routing");
    }
  }, [jwtToken, navigate]);

  console.log('Inside component: ' + message);
  return (
    <div className='preview-dataset-container'>
      {hasMessage && (
        <div className='message-box' style={{ backgroundColor: '#bdf0c0' }}>
          <div style={{ textAlign: 'center' }}>
            <p>{message}</p>
          </div>
        </div>)}
        {datasets.length ===0 ? (<h3>Sorry, there are no datasets available to preview</h3>) : (
        datasets.map(dataset => (
        <div key={dataset.id}>
          <Accordion key={dataset.id} onChange={() => handlePanelExpanded(dataset.direc, dataset.files)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
              <div className="panel-summary">
                <h3>Title: {dataset.title}</h3>
                <p>Reference: {dataset.reference}</p>
                <p>Summary: {dataset.summary}</p>
                <p>ParentDirec: {dataset.direc}</p>
                <p>Files: </p>
                <ul>
                  {dataset.files.map(file => (
                    <li key={file.file_id}>{file.file_loc}</li>
                  ))}
                </ul>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              )}
            </AccordionDetails>
          </Accordion>
        </div>
      ))
      )}
    </div>
  )
};
