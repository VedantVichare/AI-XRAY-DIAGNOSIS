import React, { useState } from 'react';
import './form.css'; // Import the separate CSS file
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faUpload, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

const Form = () => {
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    mobile: '',
    age: '',
    imagefile: null
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imagefile: e.target.files[0] });
  };

  const validateForm = () => {
    const { mobile, age } = formData;
    const mobilePattern = /^\d{10}$/;
    if (!mobilePattern.test(mobile)) {
      alert('Mobile number must be exactly 10 digits.');
      return false;
    }
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      alert('Age must be a positive number.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to access this form.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append('doctor_email', user.email);
    data.append('name', formData.name);
    data.append('surname', formData.surname);
    data.append('mobile', formData.mobile);
    data.append('age', formData.age);
    data.append('imagefile', formData.imagefile);

    try {
      const response = await axios.post('http://localhost:5000/predict', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading the file', error);
    }
  };
  
  const clearForm = () => {
    setFormData({
      name: '',
      surname: '',
      mobile: '',
      age: '',
      imagefile: null
    });
    setResult(null);
    
   
  };
  if (!user) {
    return <p className="login-message">Please log in to access this form.</p>;
  }

  return (
    <div className="form-container">
      <h1 className="form-title">Patient Information Form</h1>
      <form className="form-style" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
          className="input-field"
        />
        <input
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleInputChange}
          placeholder="Surname"
          required
          className="input-field"
        />
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleInputChange}
          placeholder="Mobile No"
          required
          className="input-field"
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          placeholder="Age"
          required
          className="input-field"
        />
        <input
          type="file"
          name="imagefile"
          onChange={handleFileChange}
          accept="image/*"
          required
          className="input-field"
        />
        <button type="submit" onClick={clearForm} className="submit-button">
        Clear Form
        </button>
        <button type="submit" className="submit-button">
          <FontAwesomeIcon icon={faUpload} /> Predict
        </button>
      </form>

      {result && (
  <div className="result-container">
    <h2><FontAwesomeIcon icon={faClipboardCheck} /> Report</h2>
    <p><strong><FontAwesomeIcon icon={faUser} /> Name:</strong> {formData.name}</p>
    <p><strong><FontAwesomeIcon icon={faUser} /> Surname:</strong> {formData.surname}</p>
    <p><strong><FontAwesomeIcon icon={faPhone} /> PhoneNo:</strong> {formData.mobile}</p>
    <p><strong>Age:</strong> {formData.age}</p>
    <p><strong>Prediction:</strong> {result.prediction}</p>
    <p><strong>Pneumonia Percentage:</strong> {result.pneumonia_percentage}%</p>
    <p><strong>Normal Percentage:</strong> {result.normal_percentage}%</p>
    <p><strong>Confidence:</strong> {result.confidence}</p>
    <p><strong>Model Used:</strong> {result.model_used}</p>
    <div className="image-comparison">
      <img src={result.image_url} alt="Original X-ray" className="result-image" />
      <img src={result.saliency_map_url} alt="Saliency Map" className="result-image" />
    </div>
  </div>
)}

    </div>
  );
};

export default Form;
