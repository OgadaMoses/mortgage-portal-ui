import React, { useState } from 'react';
import './LoanApplicationForm.css';

export default function LoanApplicationForm() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) { // 10MB
      alert('File size exceeds 10MB limit.');
      e.target.value = ''; // reset file
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Loan application submitted successfully!');
  };

  const nationalities = ["Kenyan", "Ugandan", "Tanzanian", "American", "British", "Indian", "Chinese"];
  const countries = ["Kenya", "Uganda", "Tanzania", "USA", "UK", "India", "China"];
  const counties = [
    "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa","Homa Bay","Isiolo","Kajiado",
    "Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia",
    "Lamu","Machakos","Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang’a","Nairobi",
    "Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri","Samburu","Siaya","Taita-Taveta","Tana River",
    "Tharaka-Nithi","Trans Nzoia","Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot"
  ];

  return (
    <div className="loan-form-container">
      <h2>Mortgage Loan Application</h2>
      <form className="loan-form" onSubmit={handleSubmit}>
        
        <div className="form-section">
          <div>
            <label>Full Name</label>
            <input type="text" required placeholder="Enter your full name" />
          </div>

          <div>
            <label>Email</label>
            <input type="email" required placeholder="Enter your email" />
          </div>

            <div>
                <label>Phone Number</label>
                <input type="tel" required placeholder="Enter your phone number" />
            </div>

            <div>
                <label>National ID / Passport Number</label>
                <input type="text" required placeholder="Enter your ID or Passport" />
            </div>

          <div>
            <label>Nationality</label>
            <select required>
              <option value="">Select nationality</option>
              {nationalities.map((nat) => <option key={nat} value={nat}>{nat}</option>)}
            </select>
          </div>

          <div>
            <label>Country of Residence</label>
            <select required>
              <option value="">Select country</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label>County of Residence</label>
            <select required>
              <option value="">Select county</option>
              {counties.map((county) => <option key={county} value={county}>{county}</option>)}
            </select>
          </div>

          <div>
            <label>Net Monthly Income (KES)</label>
            <input type="number" required placeholder="e.g. 150000" />
          </div>

          <div>
            <label>Loan Amount (KES)</label>
            <input type="number" required placeholder="e.g. 5000000" />
          </div>

          <div>
            <label>Loan Tenure (Years)</label>
            <input type="number" required placeholder="e.g. 15" />
          </div>
        </div>

        <div className="form-section upload-section">
          <div>
            <label>Upload Supporting Documents (Max 10MB)</label>
            <input type="file" onChange={handleFileChange} required />
            {file && <p className="file-name">Selected: {file.name}</p>}
          </div>
          <div>
            <button type="submit">Submit Application</button>
          </div>
        </div>
      </form>
    </div>
  );
}
