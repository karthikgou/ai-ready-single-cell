import { useState, useEffect } from 'react';
import { faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import close_icon from '../../assets/close_icon_u86.svg'
import close_icon_hover from '../../assets/close_icon_u86_mouseOver.svg';

export default function FilePreviewModal({ selectedFile, setPreviewBoxOpen, taskId, jwtToken, forResultFile }) {

    const [previewContent, setPreviewContent] = useState(<div className="spinner-container">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    </div>);
    const [hovered, setHovered] = useState(false);

    const handleMouseOver = () => {
        setHovered(true);
    };

    const handleMouseOut = () => {
        setHovered(false);
    };

    const handleCrossButtonClick = () => {
        setPreviewBoxOpen(false);
        setPreviewContent(<div className="spinner-container">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        </div>);
    }

    const SERVER_URL = "http://" + process.env.REACT_APP_HOST_URL + ":3001";

    const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-x: auto;
`;

    const Table = styled.table`
  border-collapse: collapse;
  width: max-content;
  min-width: 500px;
  table-layout: fixed;
`;

    const TableHeader = styled.thead`
  background-color: #f1f1f1;
  font-weight: bold;
  text-align: left;
`;

    const TableHeaderCell = styled.th`
  padding: 15px;
`;

    const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

    const TableCell = styled.td`
  padding: 10px;
`;

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedFile) {
                return null;
            }

            // Determine the file format based on the file name or content
            let tokens = selectedFile.split('.');
            let fileFormat = tokens[tokens.length - 1];

            if (!['jpg', 'png', 'pdf', 'txt', 'csv', 'tsv', 'json', 'yaml', 'yml'].includes(fileFormat)) {
                setPreviewContent(
                    <div className="unsupported-format">
                        <FontAwesomeIcon icon={faEyeSlash} />
                        &nbsp; <span>No Preview Available</span>
                    </div>
                );
                return;
            }

            else if (['csv', 'tsv'].includes(fileFormat)) {
                try {
                    let previewUrl = `${SERVER_URL}/fetchPreview?authToken=${jwtToken}`
                    if (forResultFile)
                        previewUrl += `&fileUrl=/${taskId}/${selectedFile}&forResultFile=Yes`;
                    else
                        previewUrl += `&fileUrl=${selectedFile}`;
                    console.log('previewUrl: ' + previewUrl);
                    const response = await fetch(previewUrl);
                    const lines = await response.text();

                    let rows = lines.split('\n');
                    let tableContent = [];
                    const delimiter = fileFormat === 'csv' ? ',' : '\t';
                    // Extract the header row
                    const headerRow = rows[0].split(delimiter);
                    rows = rows.slice(1); // Remove the header row from the rows array

                    for (let i = 0; i < rows.length && i < 20; i++) {
                        const columns = rows[i].split(delimiter);
                        if (columns.length > 0) {
                            tableContent.push(
                                <TableRow key={i}>
                                    {columns.map((column, index) => (
                                        <TableCell key={index}>{column}</TableCell>
                                    ))}
                                </TableRow>
                            );
                        }
                    }

                    const headerCells = headerRow.map((header, index) => (
                        <TableHeaderCell key={index}>{header}</TableHeaderCell>
                    ));

                    setPreviewContent(
                        <TableWrapper>
                            <Table>
                                <TableHeader>
                                    <tr>{headerCells}</tr>
                                </TableHeader>
                                <tbody>{tableContent}</tbody>
                            </Table>
                        </TableWrapper>
                    );
                } catch (error) {
                    console.log('Error fetching preview: ' + error);
                }
            }

            else try {
                let previewUrl = `${SERVER_URL}/download?authToken=${jwtToken}`
                if (forResultFile)
                    previewUrl += `&fileUrl=/${taskId}/${selectedFile}&forResultFile=Yes`;
                else
                    previewUrl += `&fileUrl=${selectedFile}`;
                console.log('previewUrl: ' + previewUrl);
                const response = await fetch(previewUrl);
                const blob = await response.blob();

                if (['jpg', 'png'].includes(fileFormat)) {
                    const url = URL.createObjectURL(blob);
                    setPreviewContent(
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src={url}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                        </div>
                    );
                } else if (['yml', 'yaml', 'json', 'txt'].includes(fileFormat)) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const text = reader.result;
                        setPreviewContent(
                            <pre style={{ whiteSpace: 'pre-wrap' }}>
                                {text}
                            </pre>
                        );
                    };
                    reader.readAsText(blob);
                } else if (fileFormat === 'pdf') {
                    const url = URL.createObjectURL(blob);
                    setPreviewContent(
                        <embed
                            src={url}
                            type="application/pdf"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    );
                } 
            } catch (error) {
                console.error('Error fetching file:', error);
            }
        };

        fetchData();
    }, [selectedFile]);

    if (jwtToken)
        return (
            <div className="modal" style={{ zIndex: 9999 }}>
                <div className='clear-icon'>
                    <img src={hovered ? close_icon_hover : close_icon} alt="close-icon" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={handleCrossButtonClick} />
                </div>
                {selectedFile.substring(selectedFile.lastIndexOf('/') + 1)} - Preview
                <div className="modal-content">
                    {previewContent}
                </div>
            </div>
        );
}