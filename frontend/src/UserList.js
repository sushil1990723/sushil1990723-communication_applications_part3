import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditUser from './EditUser';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const logdinuser = localStorage.getItem('loggedInUser');

  // Fetch users from the server
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');      
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Show edit modal
  const handleShowEditModal = (user) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  // Update user
  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await axios.put(`http://localhost:3001/users/${updatedUser.id}`, updatedUser);
      const updatedUsers = users.map(user =>
        user.id === updatedUser.id ? response.data : user
      );
      setUsers(updatedUsers);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Show delete modal
  const handleShowDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Delete user
  const handleDeleteUser = async () => {
    try {
      if (userToDelete) {
        await axios.delete(`http://localhost:3001/users/${userToDelete.id}`);
        const updatedUsers = users.filter(user => user.id !== userToDelete.id);        
        setUsers(updatedUsers);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h2 className="text-center mt-4 mb-4">Users List</h2>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Full Name</th>
            <th scope="col">Email</th>
            <th scope="col"></th>
          </tr>
        </thead>
        {users.length > 0 ? (
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>
                  <button className="btn btn-success" onClick={() => handleShowEditModal(user)}>Edit</button>
                  &nbsp;
                  {logdinuser !== user.email && (
                  <button type="button" className="btn btn-danger" onClick={() => handleShowDeleteModal(user)}>Delete</button>
                  )
                }
                  </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <span>No users found in the database.</span>
        )}
      </table>

      {/* Edit User Modal */}
      {showEditModal && (
        <EditUser
          user={userToEdit}
          onSave={handleUpdateUser}
          onCancel={() => setShowEditModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-block" id="myModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Confirm Delete</h4>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete {userToDelete?.fullname}?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Close</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
