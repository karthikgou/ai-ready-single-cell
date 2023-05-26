import React, { useState, useEffect } from 'react';
import { getCookie} from '../../../utils/utilFunctions';
import { useNavigate } from 'react-router-dom';
// import schema from '../../../react-json-schema/Tools/normalizeUsingScanpySchema.json';
import Form from 'react-jsonschema-form';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';

export default function ToolsDetailsComponent(props) {
    const filterName = props.filter;

    console.log(filterName);

    let jwtToken = getCookie('jwtToken');
    const [formData, setFormData] = useState({});
    const [filterSchema, setFilterSchema] = useState(null);

    const navigate = useNavigate();

    const uiSchema = {
        "methodUsedForNormalization": {
          "classNames": "category",
          "method": {
            "classNames": "sub-category",
            "ui:widget": "select",
            "ui:options": {
              "placeholder": "Select a distance metric",
              "enumOptions": [
                { "label": "Euclidean", "value": "euclidean" },
                { "label": "Manhattan", "value": "manhattan" },
                { "label": "Cosine", "value": "cosine" }
              ]
            }
          },
          "targetSum": {
            "ui:widget": "updown",
            "classNames": "sub-category"
            // "ui:options": {
            //   "placeholder": "Select a clustering method",
            //   "enumOptions": [
            //     { "label": "Hierarchical", "value": "hierarchical" },
            //     { "label": "K-Means", "value": "kmeans" },
            //     { "label": "DBSCAN", "value": "dbscan" }
              // ]
            },
          "excludeParam": {
            "ui:widget": "select",
            "classNames": "category default-class",
            "ui:options": {
              "classNames": "sub-category",
              "enumOptions": [
                { "label": "Yes", "value": "Yes" },
                { "label": "No", "value": "No" }
              ]
            }
          },
          "nameOfTheField": {
            "classNames": "sub-category",
          },
          "layersToNormalize": {
            "classNames": "sub-category",
          },
          "howTONormalizeLayers": {
            "classNames": "sub-category",
          }   
        }  
      };

      const widgets = {
        toggle: (props) => (
          <Toggle
            checked={props.value}
            onChange={(e) => props.onChange(e.target.checked)}
          />
        ),
      };


  useEffect(() => {
    import(`./../../../react-json-schema/Tools/${filterName}.json`)
    .then((module) => {
      setFilterSchema(module.default);
      console.log(filterSchema);
    })
    .catch((error) => {
      console.error('Error loading filter schema:', error);
    });
  }, [filterName, filterSchema]);

  return (
    <div className='tools-container common-class-tools-and-workflows'>
      <div className="separator heading">
        <div className="stripe"></div> 
          <h2 className="h-sm font-weight-bold">
            Tool Parameters 
          </h2> 
        <div className="stripe"></div>
      </div>
            
        {filterSchema ? (
            <Form
            schema={filterSchema}
            formData={formData}
            widgets={widgets}
            onChange={({ formData }) => setFormData(formData)}
            uiSchema={uiSchema}
        />
          ) : (
            <div>No Schema for this tool.</div>
          )}
    </div>
  )
};
