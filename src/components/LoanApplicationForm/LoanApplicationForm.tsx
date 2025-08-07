import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoanApplicationForm.css';

const LoanApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullnames: '',
    email: '',
    phonenumber: '',
    idpassportnumber: '',
    nationality: '',
    countryresidence: '',
    countyresidence: '',
    netmonthlyincome: '',
    loanamount: '',
    loantenure: ''
  });

  const [file, setFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      e.target.value = '';
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const username = localStorage.getItem('username') || '';
    const userIdentificationNumber = localStorage.getItem('useridentificationnumber') || '';

    try {
      const payload = {
        ...formData,
        username,
        useridentificationnumber: userIdentificationNumber
      };

      const response = await axios.post('http://localhost:8080/api/loans', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const loanId = response.data?.id;

      if (file && loanId) {
        const fileData = new FormData();
        fileData.append('document', file);

        await axios.post(`http://localhost:8080/api/loans/${loanId}/upload`, fileData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setSuccessMessage('Loan application submitted successfully!');
      setFormData({
        fullnames: '',
        email: '',
        phonenumber: '',
        idpassportnumber: '',
        nationality: '',
        countryresidence: '',
        countyresidence: '',
        netmonthlyincome: '',
        loanamount: '',
        loantenure: ''
      });
      setFile(null);
    } catch (error) {
      setErrorMessage('Error submitting application. Please try again.');
      console.error('Submission error:', error);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const nationalities = ["Kenyan", "Ugandan", "Tanzanian", "American", "British", "Indian", "Chinese"];
  const countries = ["Kenya", "Uganda", "Tanzania", "USA", "UK", "India", "China"];
  const counties = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
    "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
    "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang’a", "Nairobi",
    "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
    "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
  ];

  return (
    <div className="loan-form-container">
      <h2>Mortgage Loan Application</h2>

      {successMessage && (
        <div className="popup success">
          <span className="close" onClick={() => setSuccessMessage('')}>&times;</span>
          <span className="icon">✅</span>
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="popup error">
          <span className="close" onClick={() => setErrorMessage('')}>&times;</span>
          <span className="icon">❌</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form className="loan-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div>
            <label>Full Name</label>
            <input type="text" name="fullnames" value={formData.fullnames} onChange={handleChange} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Phone Number</label>
            <input type="tel" name="phonenumber" value={formData.phonenumber} onChange={handleChange} required />
          </div>
          <div>
            <label>ID / Passport Number</label>
            <input type="text" name="idpassportnumber" value={formData.idpassportnumber} onChange={handleChange} required />
          </div>
          <div>
            <label>Nationality</label>
            <select name="nationality" value={formData.nationality} onChange={handleChange} required>
              <option value="">Select nationality</option>
              {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label>Country of Residence</label>
            <select name="countryresidence" value={formData.countryresidence} onChange={handleChange} required>
              <option value="">Select country</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>County of Residence</label>
            <select name="countyresidence" value={formData.countyresidence} onChange={handleChange} required>
              <option value="">Select county</option>
              {counties.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Net Monthly Income (KES)</label>
            <input type="number" name="netmonthlyincome" value={formData.netmonthlyincome} onChange={handleChange} required />
          </div>
          <div>
            <label>Loan Amount (KES)</label>
            <input type="number" name="loanamount" value={formData.loanamount} onChange={handleChange} required />
          </div>
          <div>
            <label>Loan Tenure (Years)</label>
            <input type="number" name="loantenure" value={formData.loantenure} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-section upload-section">
          <div>
            <label>Upload Supporting Documents (Optional, Max 10MB)</label>
            <input type="file" onChange={handleFileChange} />
            {file && <p className="file-name">Selected: {file.name}</p>}
          </div>
          <div>
            <button type="submit">Submit Application</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoanApplicationForm;
