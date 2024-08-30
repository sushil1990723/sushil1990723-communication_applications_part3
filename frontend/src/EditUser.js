import React, { useState } from 'react';
import axios from 'axios';

const EditUser = ({ user, onSave, onCancel }) => {
  const [updatedUser, setUpdatedUser] = useState({ ...user });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Assuming you have an API endpoint to update a user by ID
      const response = await axios.put(`http://localhost:3001/users/${updatedUser.id}`, updatedUser);

      // Invoke onSave callback to update the user list in the parent component
      onSave(response.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="modal modal-block" id="editModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Edit User</h4>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="fullname" className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="fullname"
                name="fullname"
                value={updatedUser.fullname}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
