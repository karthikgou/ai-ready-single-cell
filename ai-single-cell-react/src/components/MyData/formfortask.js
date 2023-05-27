import React, { useState, useEffect } from 'react';
import Form from '@rjsf/core';
import schema from './createTaskSchema.json';
import { getCookie } from '../../utils/utilFunctions';

export default function TaskForm() {
  const [updatedSchema, setUpdatedSchema] = useState(schema);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState(null);
  const [datasetTitles, setDatasetTitles] = useState([]);
  const NODE_API_URL = `http://${process.env.REACT_APP_HOST_URL}:3001`;
  const WORKFLOW_API_URL = `http://${process.env.REACT_APP_HOST_URL}:80`;
  let jwtToken = getCookie('jwtToken');

  useEffect(() => {
    // Make API call to fetch dataset options
    fetch(`${NODE_API_URL}/preview/datasets?authToken=${jwtToken}`)
      .then(response => response.json())
      .then(data => {
        const titles = ['Please select a dataset.', ...Object.values(data).map(item => item.title)];
        console.log('Taitals: ' + titles);
        // Save dataset titles to state
        setDatasetTitles(titles);
        setUpdatedSchema(prevSchema => {
          const newSchema = JSON.parse(JSON.stringify(prevSchema));
          newSchema.properties.dataset.enum = titles;
          newSchema.properties.dataset.enumNames = titles;
          return newSchema;
        });
      });
  }, []);

  const handleSubmit = async ({ formData }) => {
    // Get the ID of the selected dataset from the formData object
    const datasetId = formData.dataset;
    // Call /scanpyQC endpoint to get taskId
    const scanpyResponse = await fetch(`${WORKFLOW_API_URL}/${formData.workflow}?username=sak`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!scanpyResponse.ok) {
      console.error('Failed to create ScanpyQC task');
      return;
    }
    const { taskId } = await scanpyResponse.json();
    formData['authToken'] = jwtToken;
    formData['taskId'] = taskId;
    try {
      // Make API call to submit the form with the datasetId and workflow values
      const response = await fetch(`${NODE_API_URL}/createTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Check if the response was successful
      if (response.ok) {
        console.log('Task created successfully!');
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className='workflow-container common-class-tools-and-workflows'>
      {schema && (
        <Form
          schema={updatedSchema}
          formData={formData}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
