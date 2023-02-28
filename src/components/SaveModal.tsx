import React from 'react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
// import Modal from 'react-modal';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { saveModalAtom } from '../shared/recoil/atoms/saveModalAtom';
import './SaveModal.scss';

export default function SaveModal() {
  const [saveModal, setSaveModal] = useRecoilState(saveModalAtom);
  const [name, setName] = useState("default");
  const handleClose = () => setSaveModal((prevSaveModal) => ({ ...prevSaveModal, isOpen: false }));

  const updateName = (event: any) => {
    const target = event.target as HTMLInputElement;
    setName(target.value); 
  };

  //TODO: change dialogClassName
  return (
    <Modal animation={false} show={saveModal.isOpen} onHide={handleClose} dialogClassName="default"> 
      <Modal.Header closeButton>
        <Button variant="outline-dark" onClick={async () => { 
            saveModal.saveChart(name); 
            handleClose(); 
            //TODO: Handle bad input name
        }}>
          Save
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form.Control name="Save" as="textarea" className="font-monospace" value={name} onChange={updateName} style={{ width: '100%', height: '100%', resize: 'none' }}/>
      </Modal.Body>
    </Modal>
  );
}
