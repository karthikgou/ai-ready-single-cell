import React, { useState } from 'react';
import {
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const FLASK_PREVIEW_DATASET_API = "http://localhost:5000/";

export function Preview() {
  const [htmlContent, setHtmlContent] = useState('');
  const [loadedPanels, setLoadedPanels] = useState([]);
  const [expandedPanels, setExpandedPanels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedHtmlContent, setLoadedHtmlContent] = useState({});

  const handlePanelExpanded = (path) => {
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
        fetch(FLASK_PREVIEW_DATASET_API + 'preview/dataset', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path: path}),
          })
          .then(response => response.text())
          .then(data => {
            setHtmlContent(data);
            setLoadedHtmlContent(prev => ({ ...prev, [path]: data }));
            setIsLoading(false);
            setExpandedPanels(prev => [...prev, { path, expanded: true }]);
          });
      }
      setLoadedPanels(prev => [...prev, path]);
    } else {
      setExpandedPanels(prev => prev.map(p => p.path === path ? { ...p, expanded: !p.expanded } : p));
    }
  };

  return (
    <div className='preview-dataset-container'>
      <Accordion onChange={() => handlePanelExpanded("C:/Users/rajur/Downloads")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
          <Typography>Dataset 1</Typography><br/>
          <Typography variant="caption">"filepath : C:/Users/rajur/Downloads"</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
          <Typography>Dataset 2</Typography><br/>
          <Typography variant="caption">"filepath : C:/Users/rajur/Documents"</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {expandedPanels.find(p => p.path === "C:/Users/rajur/Documents" && p.expanded) ? (
            isLoading ? (
              <CircularProgress />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            )
          ) : null}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
          <Typography>Dataset 3</Typography><br/>
          <Typography variant="caption">"filepath : C:/Users/rajur/Documents"</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {expandedPanels.find(p => p.path === "C:/Users/rajur/Documents" && p.expanded) ? (
            isLoading ? (
              <CircularProgress />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            )
          ) : null}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
          <Typography>Dataset 4</Typography><br/>
          <Typography variant="caption">"filepath : C:/Users/rajur/Documents"</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {expandedPanels.find(p => p.path === "C:/Users/rajur/Documents" && p.expanded) ? (
            isLoading ? (
              <CircularProgress />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            )
          ) : null}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
          <Typography>Dataset 5</Typography><br/>
          <Typography variant="caption">"filepath : C:/Users/rajur/Documents"</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {expandedPanels.find(p => p.path === "C:/Users/rajur/Documents" && p.expanded) ? (
            isLoading ? (
              <CircularProgress />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            )
          ) : null}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
          <Typography>Dataset 6</Typography><br/>
          <Typography variant="caption">"filepath : C:/Users/rajur/Documents"</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {expandedPanels.find(p => p.path === "C:/Users/rajur/Documents" && p.expanded) ? (
            isLoading ? (
              <CircularProgress />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            )
          ) : null}
        </AccordionDetails>
      </Accordion>
      </div>
  )
            };
