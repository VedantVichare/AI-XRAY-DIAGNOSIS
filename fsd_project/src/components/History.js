import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import './history.css'; // Ensure your CSS file is included

function History() {
    const { user, isAuthenticated } = useAuth0();
    const [infos, setInfos] = useState([]);
    const [editingInfo, setEditingInfo] = useState(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [mobile_no, setMobileNo] = useState('');
    const [surname, setSurname] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [previewMode, setPreviewMode] = useState('');
    const [activePreview, setActivePreview] = useState({ id: null, mode: null });
    const [noResultFound, setNoResultFound] = useState(false);

    const userEmail = isAuthenticated ? user.email : ""; 

    useEffect(() => {
        if (userEmail) {
            fetchInfos(userEmail);
        }
    }, [userEmail]);

    const fetchInfos = async (email) => {
        try {
            const response = await axios.get(`http://localhost:4000/infos/${email}`);
            const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setInfos(sortedData);
            setNoResultFound(false);
        } catch (error) {
            console.error("Error fetching infos:", error);
        }
    };
    const handleEdit = (info) => {
        closePreview();
        
        if (editingInfo && editingInfo._id === info._id) {
            // Reset if already editing the same item
            resetForm();
        } else {
            // Set the current info to edit
            setEditingInfo(info);
            setName(info.name);
            setAge(info.age);
            setMobileNo(info.mobile_no);
            setSurname(info.surname);
            
            // Scroll the edit form into view every time the edit button is clicked
            setTimeout(() => {
                const editForm = document.querySelector('.edit-form');
                if (editForm) {
                    editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100); // Set a slight delay to ensure state is updated
        }
    };
    
    
    const resetForm = () => {
        setEditingInfo(null);
        setName('');
        setAge('');
        setMobileNo('');
        setSurname('');
    };

    const handleUpdate = async () => {
        if (editingInfo && name && age && mobile_no && surname) {
            try {
                await axios.put(`http://localhost:4000/update/${userEmail}/${editingInfo._id}`, {
                    name,
                    age,
                    mobile_no,
                    surname,
                });
                resetForm();
                fetchInfos(userEmail);
            } catch (error) {
                console.error("Error updating info:", error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/delete/${userEmail}/${id}`);
            fetchInfos(userEmail);
        } catch (error) {
            console.error("Error deleting info:", error);
        }
    };

    const filteredInfos = infos.filter(info => {
        const fullName = `${info.name} ${info.surname}`.toLowerCase();
        return (
            info.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            info.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fullName.includes(searchTerm.toLowerCase())
        );
    });

    useEffect(() => {
        setNoResultFound(filteredInfos.length === 0 && searchTerm);
    }, [filteredInfos, searchTerm]);

    const handlePreview = (info, mode) => {
        closePreview();
        setSelectedPatient(info);
        setPreviewMode(mode);
        setActivePreview({ id: info._id, mode });
    
       
        setTimeout(() => {
            const previewContainer = document.querySelector('.preview-container');
            if (previewContainer) {
                previewContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100)
    };
    

    const closePreview = () => {
        setSelectedPatient(null);
        setPreviewMode('');
        setActivePreview({ id: null, mode: null }); // Reset active preview
    };

    return (
        <div className="history-container">
            <h1>User Information History</h1>
            
            {editingInfo && (
                <div className="edit-form">
                    <h2>Edit Patient Information</h2>
                    <div className="input-group">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Age"
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            value={mobile_no}
                            onChange={(e) => setMobileNo(e.target.value)}
                            placeholder="Mobile No"
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            placeholder="Surname"
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button onClick={handleUpdate} className="update-button">Update</button>
                        <button onClick={resetForm} className="cancel-button">Cancel</button>
                    </div>
                </div>
            )}

            <div className="search-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Patient"
                    className="search-bar"
                />
                <button className="search-button">Search</button>
            </div>

            {noResultFound && <p className="no-results">No result found.</p>} 
            {selectedPatient && (
                <div className="preview-container">
                    <button className="close-preview" onClick={closePreview}>&#x2715;</button>
                    <div className="image-preview">
                        <h3>{selectedPatient.name} {selectedPatient.surname} ({new Date(selectedPatient.date).toLocaleDateString()})</h3>
                        {previewMode === 'image' && (
                            <img src={selectedPatient.image_url} alt="Original" className="preview-image" />
                        )}
                        {previewMode === 'saliency' && (
                            <img src={selectedPatient.saliency_map_url} alt="Saliency Map" className="preview-image" />
                        )}
                        {previewMode === 'both' && (
                            <div className="both-images-container">
                                <img src={selectedPatient.image_url} alt="Original" className="preview-image" />
                                <img src={selectedPatient.saliency_map_url} alt="Saliency Map" className="preview-image" />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <table className="info-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Age</th>
                        <th>Mobile No</th>
                        <th>Prediction</th>
                        <th>Pneumonia%</th>
                        <th>Normal%</th>
                        <th>Image Preview</th>
                        <th>Saliency Preview</th>
                        <th>Both Previews</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInfos.map((info) => (
                        <tr key={info._id}>
                            <td>{new Date(info.date).toLocaleDateString()}</td>
                            <td>{info.name}</td>
                            <td>{info.surname}</td>
                            <td>{info.age}</td>
                            <td>{info.mobile_no}</td>
                            <td>{info.prediction}</td>
                            <td>{info.pneumonia_percentage.toFixed(2)}%</td>
                            <td>{info.normal_percentage.toFixed(2)}%</td>
                            <td>
                                <button 
                                    onClick={() => handlePreview(info, 'image')} 
                                    className={`preview-button ${activePreview.id === info._id && activePreview.mode === 'image' ? 'active' : ''}`}>
                                    Preview
                                </button>
                            </td>
                            <td>
                                <button 
                                    onClick={() => handlePreview(info, 'saliency')} 
                                    className={`preview-button ${activePreview.id === info._id && activePreview.mode === 'saliency' ? 'active' : ''}`}>
                                    Preview
                                </button>
                            </td>
                            <td>
                                <button 
                                    onClick={() => handlePreview(info, 'both')} 
                                    className={`preview-button ${activePreview.id === info._id && activePreview.mode === 'both' ? 'active' : ''}`}>
                                    Preview
                                </button>
                            </td>
                            <td>
                                <button 
                                    onClick={() => handleEdit(info)} 
                                    className={`edit-button ${editingInfo?._id === info._id ? 'active' : ''}`}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(info._id)} className="delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default History;








