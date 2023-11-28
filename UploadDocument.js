import React, { useRef, useState, useEffect } from "react";
import "./UploadDocument.css";
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'; // Import the js-cookie library

function UploadDocument() {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

        // Fetch uploaded files from the backend when the component mounts
        // Fetch uploaded files from the backend when the component mounts
    const fetchUploadedFiles = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/document/files');
            if (!response.ok) {
                throw new Error('Failed to fetch uploaded files.');
            }
            const data = await response.json();
            setUploadedFiles(data);

            // Store the fetched data in a cookie
            Cookies.set('uploadedFiles', JSON.stringify(data));
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        // Fetch uploaded files from the backend when the component mounts
        fetchUploadedFiles();
    }, []); // Run this effect only once when the component mounts
    
       
    
    useEffect(() => {
        const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
        setUploadedFiles(storedFiles);
    }, []);

    // Save uploaded files to localStorage whenever the uploadedFiles state changes
    useEffect(() => {
        localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));
    }, [uploadedFiles]);


    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const contentArray = new Uint8Array(event.target.result);
                // You can use contentArray if needed
            };
            reader.readAsArrayBuffer(file);

            setSelectedFile(file);
        }
    };  

    const formatFileSize = (size) => {
        if (typeof size !== 'number') {
            // Handle the case where size is not a valid number
            return 'Unknown size';
        }
    
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    
        let index = 0;
        while (size >= 1024 && index < units.length - 1) {
            size /= 1024;
            index++;
        }
    
        return `${size.toFixed(2)} ${units[index]}`;
    };
    
    
    

    const handleUploadClick = async () => {
        if (selectedFile) {
            const fileType = getFileType(selectedFile.name);
    
            if (['pdf', 'docx', 'pptx', 'txt'].includes(fileType)) {
                try {
                    const formData = new FormData();
                    formData.append('document', new Blob([JSON.stringify({ documentTitle: selectedFile.name, fileType: fileType })], { type: 'application/json' }));
                    formData.append('file', selectedFile);
    
                    const response = await fetch('http://localhost:8080/api/document/upload', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            // 'Content-Type': 'multipart/form-data', // Remove this line
                        },
                    });
    
                    if (!response.ok) {
                        throw new Error('File upload failed. Please try again.');
                    }
    
                    const data = await response.json();
    
                    const newFile = {
                        name: selectedFile.name,
                        type: fileType,
                        size: selectedFile.size,
                    };
    
                    setUploadedFiles((prevFiles) => [newFile, ...prevFiles]);
                    setSelectedFile(null);
    
                    toast.success('File successfully uploaded!', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 500,
                    });
                } catch (error) {
                    toast.error(error.message, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                    setSelectedFile(null);
                }
            } else {
                toast.error('Unsupported file type. Please choose a different file.', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                });
                setSelectedFile(null);
            }
        }
    };

    const getFileType = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        return extension;
    };


    
    
    const handleEditClick = (index) => {
        // Implement your edit logic here
        console.log("Edit button clicked for index:", index);
    };

    const handleGenerateClick = (index) => {
        // Implement your generate logic here
        console.log("Generate button clicked for index:", index);
    };

    // Add ToastContainer at the root level of your component tree
    return (
        <>
            <ToastContainer />
            <div className="welcome-back-page">
                <div className="lsbody">
                    <AppBar style={{ background: 'none', boxShadow: 'none', padding: '10px', marginTop: '20px' }}>
                        <Toolbar>
                            <img src="/logo.png" alt="App Logo" style={{ width: 100, marginLeft: '50px' }} />
                            <Typography variant="h3" style={{ fontFamily: 'Poppin, sans-serif', fontWeight: '600', fontSize: '40px', color: '#B18A00' }}
                            >AcadZen
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '10px', marginLeft: '50px' }}>
                                <div style={{ background: 'white', borderRadius: '15px', textAlign: 'center', height: '55px', width: '1101px', boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}>
                                    <Typography variant="h4" style={{ fontFamily: "Roboto Condensed", fontSize: '35px', color: '#332D2D', justifyContent: 'center', marginTop: '3px' }}
                                    >Document to Flashcard Converter
                                    </Typography>
                                </div>
                            </div>
                            <Box style={{ background: 'white', borderRadius: '10px', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '70px' }}>
                                <Box style={{ background: '#FAC712', borderRadius: '10px', width: '50px', height: '50px' }}>
                                    <IconButton color="black" style={{ fontSize: '45px' }}>
                                        <HomeIcon style={{ fontSize: '80%', width: '100%' }} />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Toolbar>
                    </AppBar>

                    <div className="upload-document-content">

                        <div className="left-panel">
                            {/* File preview or document icon */}
                            {selectedFile ? (
                                <div style={{ marginBottom: '10px', width: '100%' }}>
                                    {getFileType(selectedFile.name) === 'pdf' ? (
                                        <embed src={URL.createObjectURL(selectedFile)} type="application/pdf" width="40%" height="300px" />
                                    ) : getFileType(selectedFile.name) === 'docx' ? (
                                        // Displaying a placeholder icon for DOCX files
                                        <img
                                            src="/docx.png"
                                            alt="DOCX Icon"
                                            style={{ width: '40%', height: '300px' }}
                                        />
                                    ) : getFileType(selectedFile.name) === 'pptx' ? (
                                        // Displaying a placeholder icon for PPT files
                                        <img
                                            src="/pptx.png"
                                            alt="PPT Icon"
                                            style={{ width: '40%', height: '300px' }}
                                        />
                                    ) : getFileType(selectedFile.name) === 'txt' ? (
                                        // Displaying a placeholder icon for TXT files
                                        <img
                                            src="/txt.png"
                                            alt="TXT Icon"
                                            style={{ width: '40%', height: '300px' }}
                                        />
                                    ) : (
                                        // Displaying an image for unsupported file types
                                        <img
                                            src="/error.png"
                                            alt="error Icon"
                                            style={{ width: '40%', height: '300px' }}
                                        />
                                    )}
                                </div>
                            ) : (
                                <img
                                    src="/document icon.png"
                                    alt="Document Icon"
                                    style={{ width: 100, marginTop: '130px', marginBottom: '30px' }}
                                />
                            )}

                            {/* Display file name or Supported document types */}
                            {selectedFile ? (
                                <Typography
                                    variant="h4"
                                    style={{
                                        fontFamily: 'Roboto Condensed',
                                        fontSize: '20px',
                                        color: 'black',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontStyle: 'italic',
                                        marginTop: '15px',
                                    }}
                                >
                                    {selectedFile.name}
                                </Typography>
                            ) : (
                                <Typography
                                    variant="h4"
                                    style={{
                                        fontFamily: 'Roboto Condensed',
                                        fontSize: '20px',
                                        color: 'black',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        marginTop: '10px',
                                    }}
                                >
                                    Supported document types: PDF, DOCX, TXT, PPTX
                                </Typography>
                            )}

                            {/* Browse Button */}
                            <div style={{ marginTop: '70px' }}>
                                <Button style={{ background: '#FAC712', width: '230px', height: '45px', borderRadius: '10px' }} onClick={handleBrowseClick}>
                                    <Typography style={{ fontSize: '20px', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 'bold', color: '#332D2D', textTransform: 'none' }}>
                                        Browse
                                    </Typography>
                                </Button>
                                {/* Hidden file input */}
                                <input
                            type="file"
                            id="fileInput"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                            </div>

                            {/* Upload Document Button */}
                            <Button style={{ background: '#FAC712', width: '230px', height: '45px', borderRadius: '10px', marginTop: '150px' }} onClick={handleUploadClick}>
                                <Typography style={{ fontSize: '20px', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 'bold', color: '#332D2D', textTransform: 'none' }}>
                                    Upload Document
                                </Typography>
                            </Button>
                        </div>

                        {/* Right Panel for Displaying Uploaded Files */}
                        <div className="right-panel">
                            <Typography variant="h4" style={{ fontFamily: 'Roboto Condensed', fontSize: '30px', color: '#332D2D', textAlign: 'left', margin: '0px 10px 5px 10px' }}>
                                Uploaded Documents
                            </Typography>
                            <div className='uploadedFilePanel'>
                                {uploadedFiles.map((file, index) => (
                                    <div className="fileComponents" key={index}>
                                        {/* File icon based on the file type */}
                                        {file.type === 'pdf' && <img src="/pdf.png" alt="PDF Icon" style={{ width: '60px', margin: '5px 10px 5px 15px' }} />}
                                        {file.type === 'docx' && <img src="/docxIcon.png" alt="DOCX Icon" style={{ width: '60px', margin: '5px 10px 5px 15px' }} />}
                                        {file.type === 'pptx' && <img src="/pptx.png" alt="PPT Icon" style={{ width: '60px', margin: '5px 10px 5px 15px' }} />}
                                        {file.type === 'txt' && <img src="/txtIcon.png" alt="TXT Icon" style={{ width: '55px', margin: '8px 10px 8px 15px' }} />}
                                        {/* Add more file type checks and corresponding icons */}

                                        {/* Display file information */}
                                        <div style={{ margin: '10px' }}>
                                            <Typography variant="h6" style={{ fontFamily: 'Roboto Condensed', fontWeight: 'bold' }}>{file.name}</Typography>
                                            <Typography variant="body2">{formatFileSize(file.size)}</Typography>
                                            {/* Add other file information as needed */}
                                        </div>
                                        <div className="file-actions">
                                            <IconButton onClick={() => handleGenerateClick(index)} >
                                                <img src="/convertIcon.png" alt="Generate Icon" style={{ width: '24px', height: '24px' }} />
                                            </IconButton>
                                            <IconButton onClick={() => handleEditClick(index)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton>
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Confirmation Modal */}
                        {/* {showConfirmation && (
                            <div className="confirmation-modal">
                                <h1 style={{ margin: '10px 10px 20px 50px', fontWeight: 'bold' }}>Kaya pa ang Project?</h1>
                                <p>Kung di na kaya, Salig lang, laban lang then give up <br /> Dinasure? Awh Merry Christmas Yeeeheeey...</p>
                                <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                                <button style={{ background: '#FAC712' }} onClick={() => { confirmationCallback(); setShowConfirmation(false); }}>Confirm</button>
                            </div>
                        )} */}

                    </div>
                </div>
            </div>
        </>
    );
}

export default UploadDocument;