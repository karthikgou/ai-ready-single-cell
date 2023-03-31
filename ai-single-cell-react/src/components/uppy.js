import React, { useEffect } from 'react'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { Dashboard } from '@uppy/react'
import GoogleDrive from '@uppy/google-drive'
import OneDrive from '@uppy/onedrive'
import Dropbox from '@uppy/dropbox'
import "@uppy/dashboard/dist/style.css"

const SERVER_URL = "http://" + process.env.REACT_APP_HOST_URL + ":3001";
export default function UppyUploader(props) {
    const { isUppyModalOpen, setIsUppyModalOpen, pwd, authToken } = props;
    const uppy = new Uppy({
        id: 'fileUploader',
        autoProceed: false,
        allowMultipleUploads: true,
        restrictions: {
            maxFileSize: 1024 * 1024 * 1024, // 1 GB
            maxNumberOfFiles: 5,
        },
        debug: true,
    });
    uppy.use(GoogleDrive, {
        companionUrl: `http://${process.env.REACT_APP_HOST_URL}:3020`,
    });
    uppy.use(OneDrive, {
        companionUrl: `http://${process.env.REACT_APP_HOST_URL}:3020`,
    });
    uppy.use(Dropbox, {
        companionUrl: `http://${process.env.REACT_APP_HOST_URL}:3020`,
    });
    uppy.use(XHRUpload, {
        endpoint: `${SERVER_URL}/upload?uploadDir=${pwd}&authToken=${authToken}`,
        formData: true,
        fieldName: 'files'
    });
    uppy.on('file-added', (file) => {
        console.log('Upload destination:', file.meta.destination);
        uppy.upload();
    });
    if (isUppyModalOpen)
        return (<div className="uppy-modal"><Dashboard uppy={uppy} plugins={['GoogleDrive', 'OneDrive', 'Dropbox']} /><button onClick={() => { setIsUppyModalOpen(!isUppyModalOpen) }} >Close</button></div>)
}


