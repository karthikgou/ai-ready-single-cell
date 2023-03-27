import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleUp, faArrowUp, faCheck, faCloudUpload, faCross, faDownload, faFile, faFileUpload, faFolder, faFolderOpen, faPencil, faPlay, faPlus, faRefresh, faTrash, faTurnUp, faUpload, faVolumeXmark, faWindowClose, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { useState, useEffect } from 'react';
import './ModalWindow.css';
import './App.css';
import { red } from "@mui/material/colors";
import { getCookie } from '../utils/utilFunctions';
import UppyUploader from "./uppy";



export default function UploadData() {
    const [title, setTitle] = useState("");
    const [n_cells, setNCells] = useState("");
    const [reference, setReference] = useState("");
    const [summary, setSummary] = useState("");
    const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
    const [isUppyModalOpen, setIsUppyModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [dirNames, setDirNames] = useState([]);
    const [pwd, setPwd] = useState('/');
    const [selectedItemId, setSelectedItemId] = useState(null);
    const SERVER_URL = "node_server";
    let jwtToken = getCookie('jwtToken');
    const [isNewDirOn, setIsNewDirOn] = useState(false);


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

    useEffect(() => {
        fetchDirContents();
      }, [isUppyModalOpen]);

    async function pushOrPopName(name) {
        console.log('filesSelected: ' + selectedFiles);
        name = name.replace("//", "/");
        if (!selectedFiles.includes(name)) {
            selectedFiles.push(name);
        }
        else
            selectedFiles.pop(name)
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

        if (!isFileManagerOpen) {
            setSelectedFiles([]);
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
                    window.alert('Please log in first');
                    return;
                } else {
                    console.error(error);
                }
            });
        fetchDirContents();
    }


    const fetchDirContents = async (subdir) => {

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
                    window.alert('Please log in first');
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
            body: JSON.stringify({ fileList: selectedFiles })
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
                    window.alert(`Failed to delete ${response.errorCount} file(s).`)
                }
            })
            .catch(error => {
                if (error.message === 'Access denied. Please log in.') {
                    // display dialog box for access denied error
                    alert('Access denied. Please log in.');
                } 
                else if (error.message === 'File(s) being used by datasets.') {
                    alert('Unable to delete. File(s) being used by datasets.');
                } else {
                    console.log('Error deleting file: ', error);
                }
            });
        setSelectedFiles([]);
        fetchDirContents();
    }


    function downloadFiles() {

        const apiUrl = `${SERVER_URL}/download`;

        // If fileUrl is not empty, call the API with fileUrl as query parameter
        if (selectedFiles.length == 1) {
            const fileUrl = selectedFiles[0]
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

        else if (selectedFiles.length > 1) {
            fetch(`${apiUrl}?authToken=${jwtToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileList: selectedFiles })
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

        fetch(`${SERVER_URL}/createDataset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                n_cells: n_cells,
                reference: reference,
                summary: summary,
                title: title,
                files: selectedFiles,
                authToken: jwtToken
            })
        })
            .then(response => {
                if (response.status === 201) {
                    alert('Dataset created successfully.');
                    window.location.reload();
                } else {
                    console.log('Error creating dataset:', response);
                }
            })
            .catch(error => {
                alert('Error creating dataset.');
                console.error('Error creating dataset:', error);
            });
    };

    return (
        <div className="main-content">
            <h2><span>Input</span></h2>
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
                    <button type="button" onClick={toggleModal}>
                        <FontAwesomeIcon icon={faFolderOpen} />
                    </button>
                    {isFileManagerOpen && (
                        <div className="modal">
                            <div>
                            <button type="button" onClick={() => setIsNewDirOn(true)} style={{display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer"}}>
                                <FontAwesomeIcon icon={faPlus} /> New Folder
                            </button> &nbsp;&nbsp;
                            <button type="button" onClick={() => downloadFiles(selectedFiles)} style={{display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer"}}>
                                <FontAwesomeIcon icon={faDownload} /> Download
                            </button>&nbsp;&nbsp;
                            <button type="button" onClick={() => { deleteFiles(selectedFiles); }} style={{display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer"}}>
                                <FontAwesomeIcon icon={faTrash} color={red} /> Delete
                            </button>&nbsp;&nbsp;
                            <button type="button" onClick={() => { fetchDirContents() }} style={{display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer"}}>
                                <FontAwesomeIcon icon={faRefresh} color={red} /> Refresh
                            </button></div>
                            <div className="modal-content" style={{overflowX:"hidden", overflowY:"hidden"}}>
                                <div className="modal-item" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 10 }}>
                                    <div style={{ paddingLeft: '18%', width: "45%" }}>Name</div>
                                    <div style={{ width: "25%" }}>Type</div>
                                    <div style={{ width: "25%", paddingLeft: "5%" }}>Time Created</div>
                                </div>
                                <div className="modal-content">
                                    <div className="modal-item" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 10 }}>
                                        <div style={{ paddingLeft: '16%', width: "40%" }} onClick={() => fetchDirContents('..')}><FontAwesomeIcon icon={faTurnUp} /></div>
                                    </div>
                                    {dirNames.map((dir, index) => (
                                        <div className="modal-item" key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                            <FontAwesomeIcon icon={faFolder} onClick={log} /> &nbsp;&nbsp;
                                            <FontAwesomeIcon icon={faPencil} id={`fedit${index + 1}`} onClick={() => { handleRenameIcon(`d${index}`); }} /> &nbsp;&nbsp;
                                            <input type='checkbox' align='center' onChange={() => pushOrPopName(pwd + '/' + dir.name)}></input>
                                            {selectedItemId === `d${index}` ? (
                                                <input type="text" defaultValue={dir.name} onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        handleUpdateText(`d${index}`, event.target.value);
                                                    }
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
                                                <input type='checkbox' onChange={async () => { pushOrPopName(pwd + '/' + file.name); }}></input>
                                                {selectedItemId === `f${index}` ? (
                                                    <input type="text" defaultValue={file.name} onKeyDown={(event) => {
                                                        if (event.key === 'Enter') {
                                                            handleUpdateText(`f${index}`, event.target.value);
                                                        }
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
                                        {isNewDirOn && (<div class="modal-item"><input type="text" defaultValue="New Folder" onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                fetch(`${SERVER_URL}/createNewFolder?pwd=${pwd}&folderName=${event.target.value}&authToken=${jwtToken}`, {
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
                                                        window.alert('Please log in first');
                                                        console.error(error);
                                                        return;
                                                    });
                                            }
                                        }}
                                            autoFocus
                                        /></div>)}
                                    </div>
                                </div>
                            </div>
                            <div><button onClick={() => { setPwd('/'); toggleModal(); }} style={{display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer"}}><FontAwesomeIcon icon={faCheck} style={{fontWeight: "bold"}}/> Select Files</button>&nbsp;&nbsp;
                            <button onClick={() => { setIsUppyModalOpen(!isUppyModalOpen) }} style={{display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer"}}> <FontAwesomeIcon icon={faArrowAltCircleUp}/> Upload Here </button>&nbsp;&nbsp;
                            {isUppyModalOpen && (
                                <UppyUploader isUppyModalOpen={isUppyModalOpen} setIsUppyModalOpen={setIsUppyModalOpen} pwd={pwd} authToken={jwtToken}/>
                            )}
                            <button style={{display: "inline-block", padding: "10px 10px", borderRadius: '5px', cursor: "pointer"}} onClick={async () => {
                                await setSelectedFiles([]); toggleModal(); setPwd('/')
                            }} > <FontAwesomeIcon icon={faXmark} style={{fontWeight: "bold"}}/> Close</button></div>
                        </div>)
                    }
                </div>
                <br />
                <h2><span>Parameters</span></h2>
                <b>Title</b><br />
                <input type="text" id="title" name="title" value={title} style={{ width: "97%" }} onChange={(e) => setTitle(e.target.value)} /><br /><br />

                <b>Number of Cells</b><br />
                <input type="number" id="n_cells" name="n_cells" value={n_cells} style={{ width: "97%" }} onChange={(e) => setNCells(e.target.value)} /><br /><br />

                <b>Reference</b><br />
                <input type="text" id="reference" name="reference" value={reference} style={{ width: "97%" }} onChange={(e) => setReference(e.target.value)} /><br /><br />

                <b>Summary</b><br />
                <textarea id="summary" name="summary" value={summary} style={{ width: "97%", height: "100px" }} onChange={(e) => setSummary(e.target.value)}></textarea><br /><br />

                <button type="submit" style={{ backgroundColor: "#3c5379", borderRadius: "5px" }} onClick={handleSubmit}><FontAwesomeIcon icon={faPlay} /> Submit</button>

            </div></div>
        </div >
    )
}
