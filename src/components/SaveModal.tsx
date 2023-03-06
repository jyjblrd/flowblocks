import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
// import Modal from 'react-modal';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form, Card } from 'react-bootstrap';
import { saveModalAtom } from '../shared/recoil/atoms/saveModalAtom';
import './SaveModal.scss';

export default function SaveModal() {
  const [saveModal, setSaveModal] = useRecoilState(saveModalAtom);
  const [name, setName] = useState('default');
  const [showError, setShowError] = useState(0);
  const handleClose = () => setSaveModal((prevSaveModal) => ({ ...prevSaveModal, isOpen: false }));

  const updateName = (event: any) => {
    setShowError(0);
    const target = event.target as HTMLInputElement;
    setName(target.value);
  };

  const saveChart = () => {
    if (name === '' || name == null) {
      setShowError(1);
    } else {
      saveModal.saveChart(name);
      handleClose();
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      saveChart();
    }
  };

  // TODO: change dialogClassName
  return (
    <Modal animation={false} show={saveModal.isOpen} onHide={handleClose} dialogClassName="default">
      <Modal.Header closeButton>
        <Button
          variant="outline-dark"
          onClick={() => {saveChart();}}
        >
          Save
        </Button>
      </Modal.Header>
      <Card className="shadow p-3">
        <h5>Enter name to save chart as</h5>
        <Form.Control name="nodeTypeId" onChange={updateName} value={name} placeholder="Name" onKeyDown={handleKeyDown}/>
        <div>
          <h5 style={{ color : 'red', marginTop : '5px', display : 'block' }}>
            {showError ? 'Please enter a name' : ''}
          </h5>
        </div>
        {/* <Form.Control name="description" className="mt-2" size="sm" onChange={handleChange} as="textarea" rows={2} value={nodeType.description} placeholder="Description" /> */}
      </Card>
      
      {/* <Modal.Body>
        <Form.Control name="Save" as="textarea" className="font-monospace" value={name} onChange={updateName} style={{ width: '100%', height: '100%', resize: 'none' }} />
      </Modal.Body> */}
    </Modal>
  );
}
