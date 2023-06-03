import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleUp, faCheck, faDownload, faFile, faFolder, faPencil, faPlus, faRefresh, faTrash, faTurnUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import './ModalWindow.css';
import UppyUploader from "./uppy";
import { red } from "@mui/material/colors";
import { useNavigate } from 'react-router-dom';

export default function FileManagerModal({ setEnabledCheckboxes, setFileToPreview, tempFileList, fileNames, dirNames, jwtToken, fetchDirContents, pwd, setPwd, setPreviewBoxOpen, selectedFiles, setSelectedFiles, setErrorMessage, setTempFileList, enabledCheckboxes, toggleModal }) {

    const [isUppyModalOpen, setIsUppyModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isNewDirOn, setIsNewDirOn] = useState(false);
    const [usedStorage, setUsedStorage] = useState(0);
    const [totalStorage, setTotalStorage] = useState(1);
    const navigate = useNavigate();

    const SERVER_URL = "http://" + process.env.REACT_APP_HOST_URL + ":3001";

    useEffect(() => {
        if (jwtToken) {
            getStorageDetails();
            fetchDirContents();
        }
        else
            navigate('/routing');
    }, [isUppyModalOpen]);

    const handleFileClick = async (fileName) => {
        setFileToPreview(`${pwd}/${fileName}`);
        setPreviewBoxOpen(true);
    };

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

    async function pushOrPopName(name) {
        name = name.replace("//", "/");
        const index = tempFileList.indexOf(name);
        if (index === -1) {
            tempFileList.push(name);
        } else {
            tempFileList.splice(index, 1);
        }
        console.log('filesSelected: ' + tempFileList);
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

    const getStorageDetails = async () => {

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

    return <div className="modal">
        <div>
            <button type="button" className="fileManagerButton" onClick={() => setIsNewDirOn(true)} >
                <FontAwesomeIcon icon={faPlus} /> New Folder
            </button> &nbsp;&nbsp;
            <button type="button" className="fileManagerButton" onClick={() => downloadFiles(selectedFiles)} >
                <FontAwesomeIcon icon={faDownload} /> Download
            </button>&nbsp;&nbsp;
            <button type="button" className="fileManagerButton" onClick={() => { deleteFiles(selectedFiles); }} >
                <FontAwesomeIcon icon={faTrash} color={red} /> Delete
            </button>&nbsp;&nbsp;
            <button type="button" className="fileManagerButton" onClick={() => { fetchDirContents() }} >
                <FontAwesomeIcon icon={faRefresh} color={red} /> Refresh
            </button></div>
        <div className="modal-content" style={{ overflowX: "hidden", overflowY: "hidden" }}>
            <div className="modal-item" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 10 }}>
                <div style={{ paddingLeft: '15%', width: "45%" }}>Name</div>
                <div style={{ width: "25%" }}>Type</div>
                <div style={{ width: "25%", paddingLeft: "5%" }}>Time Created</div>
            </div>
            <div className="modal-content-scroll">
                <div className="modal-item" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 10 }}>
                    <div style={{ paddingLeft: '16%', width: "40%" }} onClick={() => fetchDirContents('..')}><FontAwesomeIcon icon={faTurnUp} /></div>
                </div>
                {dirNames.map((dir, index) => (
                    <div className="modal-item" key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <FontAwesomeIcon icon={faFolder} onClick={log} /> &nbsp;&nbsp;
                        <FontAwesomeIcon icon={faPencil} id={`fedit${index + 1}`} onClick={() => { handleRenameIcon(`d${index}`); }} /> &nbsp;&nbsp;
                        <input type='checkbox' id={`dirCheckbox${index + 1}`} className="selectFiles" align='center' onChange={async () => { setEnabledCheckboxes([...enabledCheckboxes, `dirCheckbox${index + 1}`]); await pushOrPopName(pwd + '/' + dir.name) }}></input>
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
                            <div style={{ paddingLeft: '6%', width: "40%", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <a style={{ color: "black", textDecoration: "none" }} title={dir.name} onClick={() => { fetchDirContents(dir.name); }}>
                                    {dir.name}
                                </a>
                            </div>
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
                            <input type='checkbox' id={`fileCheckbox${index + 1}`} className="selectFiles" onChange={async () => { setEnabledCheckboxes([...enabledCheckboxes, `fileCheckbox${index + 1}`]); await pushOrPopName(pwd + '/' + file.name); }}></input>
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
                                <div style={{ paddingLeft: '6%', width: "40%", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`fid${index + 1}`}>
                                    <span title={file.name} onClick={() => {
                                        handleFileClick(file.name);
                                    }}>
                                        {file.name}
                                    </span>
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
                                    } else if (event.key === 'Escape') {
                                        setIsNewDirOn(false);
                                    }
                                }}
                                onBlur={(event) => {
                                    if (isNewDirOn) createNewFolder(event.target.value);
                                }}
                                autoFocus
                                onFocus={(event) => {
                                    event.target.select();
                                }}
                            />  &nbsp;&nbsp;
                            <FontAwesomeIcon
                                icon={faXmark}
                                style={{ fontWeight: "bold", cursor: "pointer" }}
                                onMouseDown={(event) => {
                                    event.preventDefault();
                                    setIsNewDirOn(false);
                                }}
                            />
                        </div>
                    )}
                    <div style={{ height: "20px" }}></div>
                </div>
            </div>
        </div>
        <div style={{ paddingTop: "7px" }}><button className="fileManagerButton" onClick={() => { setPwd('/'); setSelectedFiles(tempFileList); toggleModal(); }} ><FontAwesomeIcon icon={faCheck} style={{ fontWeight: "bold" }} /> Select Files</button>&nbsp;&nbsp;
            <button className="fileManagerButton" onClick={() => { setIsUppyModalOpen(!isUppyModalOpen) }} > <FontAwesomeIcon icon={faArrowAltCircleUp} /> Upload Here </button>&nbsp;&nbsp;
            {isUppyModalOpen && (
                <UppyUploader isUppyModalOpen={isUppyModalOpen} setIsUppyModalOpen={setIsUppyModalOpen} pwd={pwd} authToken={jwtToken} freeSpace={totalStorage - usedStorage} />
            )}
            <button className="fileManagerButton" onClick={async () => {
                await setTempFileList([]); setSelectedFiles([]); toggleModal(); setPwd('/')
            }} > <FontAwesomeIcon icon={faXmark} style={{ fontWeight: "bold" }} /> Close</button></div>
    </div>
}