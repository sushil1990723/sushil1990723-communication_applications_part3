import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import axios from 'axios';


const DocumentManagement = () => {
  const [uploads, setUploads] = useState([]);
  const [fileDescription, setFileDescription] = useState('');
  const [file, setFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [fileToEdit, setFileToEdit] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://localhost:3001/uploads');
      setUploads(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleUpload = async () => {
    if (fileDescription.trim() === '') {
      alert('Please fill in the file description');
      return;
    }
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();

    const filedata = file.name;
    formData.append('file', filedata);
    formData.append('fileDescription', fileDescription);

    try {
      await axios.post('http://localhost:3001/uploads', { filedata, fileDescription });
      setFileDescription('');
      setFile(null);
      fetchDocuments();
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('File upload failed');
    }
  };

  const handleDeleteDocument = async () => {
    try {
      await axios.delete(`http://localhost:3001/uploads/${fileToDelete.id}`);
      setUploads(uploads.filter(upload => upload.id !== fileToDelete.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleEditFile = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/uploads/${fileToEdit.id}`, {
        fileDescription: editDescription,
      });
      setUploads(
        uploads.map(upload =>
          upload.id === fileToEdit.id ? response.data : upload
        )
      );
      setShowEditModal(false);
    } catch (error) {
      console.error('Error editing document:', error);
    }
  };

  return (
    <div>
      <h2 className='mt-4 mb-4'>Document Management</h2>

      <Table>
        <thead>
          <tr>
            <th>Description</th>
            <th>File Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="documentListTableBody">
          {uploads.map((upload, index) => (
            <tr key={index}>
              <td>{upload.label}</td>
              <td>{upload.originalfilename}</td>
              <td>
                <Button variant="success" onClick={() => {
                  setFileToEdit(upload);
                  setEditDescription(upload.fileDescription);
                  setShowEditModal(true);
                }}>
                  Edit
                </Button> &nbsp;
                <Button variant="danger" onClick={() => {
                  setFileToDelete(upload);
                  setShowDeleteModal(true);
                }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Upload Button */}
      <Button variant="primary" onClick={() => setShowUploadModal(true)}>
        Upload Document
      </Button>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <input type="text" value={fileDescription} placeholder="Enter file description" onChange={e => setFileDescription(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {fileToDelete?.fileDescription}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteDocument}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditFile}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DocumentManagement;
