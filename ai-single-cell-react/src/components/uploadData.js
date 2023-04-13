import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleUp, faCheck, faDownload, faFile, faFolder, faFolderOpen, faPencil, faPlus, faRefresh, faTrash, faTurnUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModalWindow.css';
import { red } from "@mui/material/colors";
import { getCookie } from '../utils/utilFunctions';
import UppyUploader from "./uppy";
import Form from "@rjsf/core";

import schema from "./uploadDataSchema.json";
import RightRail from "./rightRail";

export default function UploadData() {
    const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
    const [isUppyModalOpen, setIsUppyModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [dirNames, setDirNames] = useState([]);
    const [pwd, setPwd] = useState('/');
    const [selectedItemId, setSelectedItemId] = useState(null);
    const SERVER_URL = "http://" + process.env.REACT_APP_HOST_URL + ":3001";
    let jwtToken = getCookie('jwtToken');
    const [isNewDirOn, setIsNewDirOn] = useState(false);
    const [formData, setFormData] = useState({});
    const [usedStorage, setUsedStorage] = useState(0);
    const [totalStorage, setTotalStorage] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [enabledCheckboxes, setEnabledCheckboxes] = useState([]);
    const [tempFileList, setTempFileList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setErrorMessage('');
        }, 5000);
        // Return a cleanup function to cancel the timeout when the component unmounts
        return () => clearTimeout(timeoutId);
    }, [errorMessage]);

    const handleRenameIcon = (id) => {
        fileNames.map((item, index) => {
            if (`f${index}` === id) {
                setSelectedItemId(id);
            }
        });
        dirNames.map((item, index) => {
            if (`d${index}` === id) {
                setSelectedItemId(id);
            }
        });
    }

    const SubmitButton = ({ disabled, onClick }) => {
        const handleClick = () => {
            setIsButtonDisabled(true);
            onClick();
        };

        return (
            <button
                type="submit"
                onClick={handleClick}
                disabled={isButtonDisabled || disabled}
            >
                Submit
            </button>
        );
    };

    useEffect(() => {
        getStorageDetails();
        fetchDirContents();
    }, [isUppyModalOpen]);

    async function pushOrPopName(name) {
        console.log('filesSelected: ' + tempFileList);
        name = name.replace("//", "/");
        if (!tempFileList.includes(name)) {
            tempFileList.push(name);
        }
        else
            tempFileList.pop(name)
    }

    const handleUpdateText = (id, newText) => {
        fileNames.map((file, index) => {
            if (`f${index}` === id) {
                renameFileOrDir(file.name, newText);
            }
            fetchDirContents();
        });
        dirNames.map((dir, index) => {
            if (`d${index}` === id) {
                renameFileOrDir(dir.name, newText);
            }
            fetchDirContents();
        });

        setSelectedItemId(null);
    };
    // toggle modal window visibility
    const toggleModal = async () => {
        await setIsFileManagerOpen(!isFileManagerOpen);

        setSelectedFiles(tempFileList);

        if (!isFileManagerOpen) {
            setSelectedFiles([]);
            setTempFileList([]);
            fetchDirContents();
        }
    }

    const renameFileOrDir = async (oldFileOrDir, newFileOrDir) => {
        const renameApiUrl = `${SERVER_URL}/renameFile`;
        let errorHandled = false;
        fetch(`${renameApiUrl}?oldName=${pwd}/${oldFileOrDir}&newName=${pwd}/${newFileOrDir}&authToken=${jwtToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.status === 403) {
                    throw new Error('Please log in first');
                }
                return response.json();
            })
            .catch(error => {
                if (!errorHandled && error.message === 'Please log in first') {
                    navigate('/routing');
                    return;
                } else {
                    console.error(error);
                }
            });
        fetchDirContents();
    }


    const fetchDirContents = async (subdir) => {

        enabledCheckboxes.forEach((checkboxId) => {
            const checkbox = document.getElementById(checkboxId);
            checkbox.checked = false;
        });

        let newDir = ''
        jwtToken = getCookie('jwtToken');

        if (subdir == '..') {
            let slashIndex = pwd.lastIndexOf('/');
            newDir = slashIndex !== -1 ? pwd.substring(0, slashIndex) : pwd;
            setPwd(newDir)
        }
        else if (subdir) {
            newDir = pwd + '/' + subdir;
            setPwd(pwd + '/' + subdir);
        }
        else
            newDir = pwd

        fetch(`${SERVER_URL}/getDirContents?dirPath=${newDir}&authToken=${jwtToken}`)
            .then(response => {
                if (response.status === 403) {
                    throw new Error('Please log in first');
                }
                return response.json();
            })
            .catch(error => {
                setIsFileManagerOpen(false);
                if (error.message === 'Please log in first') {
                    navigate('/routing');
                } else {
                    console.error(error);
                }

            })
            .then(data => {
                setDirNames(data.Directories);
                setFileNames(data.Files);
            });

    }

    function log() {
        console.log('sak: ' + selectedFiles)
    }

    async function deleteFiles() {
        const deleteApiUrl = `${SERVER_URL}/deleteFiles?authToken=${jwtToken}`
        await fetch(`${deleteApiUrl}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileList: tempFileList })
        })
            .then(response => {
                if (response.status === 403) {
                    throw new Error('Access denied. Please log in.');
                }
                if (response.status === 401) {
                    throw new Error('File(s) being used by datasets.');
                }
                return response;
            })
            .then(response => response.json())
            .then(response => {
                if (response.errorCount > 0) {
                    setErrorMessage(`Failed to delete ${response.errorCount} file(s).`);
                }
            })
            .catch(error => {
                if (error.message === 'Access denied. Please log in.') {
                    navigate('/routing');
                }
                else if (error.message === 'File(s) being used by datasets.') {
                    setErrorMessage('Delete failed. File(s) being used by datasets.');
                } else {
                    console.log('Error deleting file: ', error);
                }
            });
        setTempFileList([]);
        fetchDirContents();
    }

    const getStorageDetails = async () => {

        jwtToken = getCookie('jwtToken');

        fetch(`${SERVER_URL}/getStorageDetails?authToken=${jwtToken}`)
            .then(response => {
                if (response.status === 403) {
                    throw new Error('Please log in first');
                }
                return response.json();
            })
            .catch(error => {
                if (error.message === 'Please log in first') {
                    navigate('/routing');
                } else {
                    console.error(error);
                }

            })
            .then(data => {
                setUsedStorage(data.used);
                setTotalStorage(data.allowed);
            });

    }

    function createNewFolder(folderName) {
        fetch(`${SERVER_URL}/createNewFolder?pwd=${pwd}&folderName=${folderName}&authToken=${jwtToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.status === 403) {
                    throw new Error('Please log in first');
                }
                setIsNewDirOn(false);
                fetchDirContents();
                return response.json();
            })
            .catch(error => {
                navigate('/routing');
                console.error(error);
                return;
            });
    }


    function downloadFiles() {

        const apiUrl = `${SERVER_URL}/download`;

        // If fileUrl is not empty, call the API with fileUrl as query parameter
        if (tempFileList.length == 1) {
            const fileUrl = tempFileList[0]
            const filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
            fetch(`${apiUrl}?fileUrl=${fileUrl}&authToken=${jwtToken}`)
                .then(response => {
                    return response.blob();
                })
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    // Add the link to the DOM and trigger the download
                    document.body.appendChild(link);
                    link.click();
                    // Remove the link from the DOM
                    // document.body.removeChild(link);
                })
                .catch(error => {
                    console.error('Error downloading file:', error);
                });
        }

        else if (tempFileList.length > 1) {
            fetch(`${apiUrl}?authToken=${jwtToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileList: tempFileList })
            })
                .then(response => {
                    return response.blob();
                })
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = "files.zip";
                    document.body.appendChild(link);
                    link.click();
                })
                .catch(error => {
                    console.error('Error downloading file:', error);
                });
        }


    }

    const handleSubmit = (event) => {
        if (selectedFiles === undefined || selectedFiles.length === 0) {
            setErrorMessage('Select at least one file.');
            return;
        }
        else if (jwtToken === undefined || jwtToken.length === 0) {
            setErrorMessage('Please log in first.');
            return;
        }
        formData['authToken'] = jwtToken;
        formData['files'] = selectedFiles;
        fetch(`${SERVER_URL}/createDataset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (response.status === 201) {
                    navigate('/mydata/preview-datasets', { state: { message: 'Dataset created successfully.' } });
                } else {
                    console.log('Error creating dataset:', response);
                }
            })
            .catch(error => {
                setErrorMessage('Error creating dataset.');
                console.error('Error creating dataset:', error);
            });
        setIsButtonDisabled(true);
        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 5000);
    };

    if (jwtToken === '' || jwtToken === undefined) {
        navigate("/routing");
    }

    else return (
        <div className="page-container">
            <div className="left-nav">
                {/* <LeftNav /> */}
            </div>
            <div className="main-content">
                {(errorMessage !== '') && (
                    <div className='message-box' style={{ backgroundColor: 'lightpink' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p>{errorMessage}</p>
                        </div>
                    </div>)}
                <div className="main-content">
                    <h2 style={{ textAlign: "left" }}><span>Input</span></h2>
                    <div>        <div>
                        <div id="upload-data-div">
                            <b>Choose your files *</b> <br />
                            <div id='files-selected'>
                                {selectedFiles.map((item, index) => (
                                    <div key={index} onClick={() => console.log(item)}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={toggleModal} style={{ fontSize: "1em", padding: "10px", borderRadius: "5px" }}>
                                <FontAwesomeIcon icon={faFolderOpen} />
                            </button>
                            {isFileManagerOpen && (
                                <div className="modal">
                                    <div>
                                        <button type="button" onClick={() => setIsNewDirOn(true)} style={{ display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer" }}>
                                            <FontAwesomeIcon icon={faPlus} /> New Folder
                                        </button> &nbsp;&nbsp;
                                        <button type="button" onClick={() => downloadFiles(selectedFiles)} style={{ display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer" }}>
                                            <FontAwesomeIcon icon={faDownload} /> Download
                                        </button>&nbsp;&nbsp;
                                        <button type="button" onClick={() => { deleteFiles(selectedFiles); }} style={{ display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer" }}>
                                            <FontAwesomeIcon icon={faTrash} color={red} /> Delete
                                        </button>&nbsp;&nbsp;
                                        <button type="button" onClick={() => { fetchDirContents() }} style={{ display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer" }}>
                                            <FontAwesomeIcon icon={faRefresh} color={red} /> Refresh
                                        </button></div>
                                    <div className="modal-content" style={{ overflowX: "hidden", overflowY: "hidden" }}>
                                        <div className="modal-item" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 10 }}>
                                            <div style={{ paddingLeft: '15%', width: "45%" }}>Name</div>
                                            <div style={{ width: "25%" }}>Type</div>
                                            <div style={{ width: "25%", paddingLeft: "5%" }}>Time Created</div>
                                        </div>
                                        <div>
                                            <div className="modal-item" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 10 }}>
                                                <div style={{ paddingLeft: '16%', width: "40%" }} onClick={() => fetchDirContents('..')}><FontAwesomeIcon icon={faTurnUp} /></div>
                                            </div>
                                            {dirNames.map((dir, index) => (
                                                <div className="modal-item" key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                                    <FontAwesomeIcon icon={faFolder} onClick={log} /> &nbsp;&nbsp;
                                                    <FontAwesomeIcon icon={faPencil} id={`fedit${index + 1}`} onClick={() => { handleRenameIcon(`d${index}`); }} /> &nbsp;&nbsp;
                                                    <input type='checkbox' id={`dirCheckbox${index + 1}`} className="selectFiles" align='center' onChange={() => { setEnabledCheckboxes([...enabledCheckboxes, `dirCheckbox${index + 1}`]); pushOrPopName(pwd + '/' + dir.name) }}></input>
                                                    {selectedItemId === `d${index}` ? (
                                                        <input type="text" defaultValue={dir.name} onKeyDown={(event) => {
                                                            if (event.key === 'Enter') {
                                                                handleUpdateText(`d${index}`, event.target.value);
                                                            }
                                                        }} onBlur={(event) => {
                                                            handleUpdateText(`d${index}`, event.target.value);
                                                        }}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <div style={{ paddingLeft: '6%', width: "40%" }}><a style={{ color: "black" }} onClick={() => { fetchDirContents(dir.name); }}>{dir.name}</a></div>
                                                    )}
                                                    <div style={{ paddingLeft: '4%', width: "25%" }}>Folder</div>
                                                    <div style={{ paddingLeft: '5%', width: "25%" }}>{dir.created}</div>
                                                </div>
                                            ))}
                                            <div>
                                                {fileNames.map((file, index) => (
                                                    <div className="modal-item" key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                                        <FontAwesomeIcon icon={faFile} /> &nbsp;&nbsp;&nbsp;
                                                        <FontAwesomeIcon icon={faPencil} id={`fedit${index + 1}`} onClick={() => { handleRenameIcon(`f${index}`); }} /> &nbsp;&nbsp;
                                                        <input type='checkbox' id={`fileCheckbox${index + 1}`} className="selectFiles" onChange={async () => { setEnabledCheckboxes([...enabledCheckboxes, `fileCheckbox${index + 1}`]); pushOrPopName(pwd + '/' + file.name); }}></input>
                                                        {selectedItemId === `f${index}` ? (
                                                            <input type="text" defaultValue={file.name} onKeyDown={(event) => {
                                                                if (event.key === 'Enter') {
                                                                    handleUpdateText(`f${index}`, event.target.value);
                                                                }
                                                            }} onBlur={(event) => {
                                                                handleUpdateText(`f${index}`, event.target.value);
                                                            }}
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <div style={{ paddingLeft: '6%', width: "40%" }} id={`fid${index}+1`}>
                                                                {file.name}
                                                            </div>
                                                        )}

                                                        <div style={{ paddingLeft: '4%', width: "25%" }}>{file.type + "File"}</div>
                                                        <div style={{ paddingLeft: '5%', width: "25%" }}>{file.created}</div>
                                                    </div>
                                                ))}
                                                {isNewDirOn && (
                                                    <div className="modal-item">
                                                        <input
                                                            type="text"
                                                            defaultValue="New Folder"
                                                            onKeyDown={(event) => {
                                                                if (event.key === 'Enter') {
                                                                    createNewFolder(event.target.value);
                                                                }
                                                            }}
                                                            onBlur={(event) => {
                                                                createNewFolder(event.target.value);
                                                            }}
                                                            autoFocus
                                                        />
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                    <div><button onClick={() => { setPwd('/'); toggleModal(); }} style={{ display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer" }}><FontAwesomeIcon icon={faCheck} style={{ fontWeight: "bold" }} /> Select Files</button>&nbsp;&nbsp;
                                        <button onClick={() => { setIsUppyModalOpen(!isUppyModalOpen) }} style={{ display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer" }}> <FontAwesomeIcon icon={faArrowAltCircleUp} /> Upload Here </button>&nbsp;&nbsp;
                                        {isUppyModalOpen && (
                                            <UppyUploader isUppyModalOpen={isUppyModalOpen} setIsUppyModalOpen={setIsUppyModalOpen} pwd={pwd} authToken={jwtToken} freeSpace={totalStorage - usedStorage} />
                                        )}
                                        <button style={{ display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer" }} onClick={async () => {
                                            await setTempFileList([]); setSelectedFiles([]); toggleModal(); setPwd('/')
                                        }} > <FontAwesomeIcon icon={faXmark} style={{ fontWeight: "bold" }} /> Close</button></div>
                                </div>)
                            }
                        </div>
                        <br />
                        <h2 style={{ textAlign: "left" }}><span>Parameters</span></h2>


                        <Form
                            schema={schema}
                            formData={formData}
                            onChange={({ formData }) => setFormData(formData)}
                            onSubmit={handleSubmit}
                            SubmitButton={SubmitButton}
                        />

                    </div></div>
                </div >
            </div>
            <div className="right-rail">
                <RightRail />
            </div>
        </div>
    )
}
