import React from 'react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
//import Modal from 'react-modal';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { loadModalAtom } from '../shared/recoil/atoms/loadModalAtom';
import './LoadModal.scss';
import { Rect } from '@dnd-kit/core/dist/utilities';

export default function LoadModal() {
  const [loadModal, setLoadModal] = useRecoilState(loadModalAtom);
  const [name, setName] = useState("default");
  const handleClose = () => setLoadModal((prevLoadModal) => ({ ...prevLoadModal, isOpen: false }));

  const updateName = (event: any) => {
    const target = event.target as HTMLInputElement;
    setName(target.value); 
  };

  //Change dialogClassName
  return (
    <Modal animation={false} show={loadModal.isOpen} onHide={handleClose} dialogClassName="default"> 
      <Modal.Header closeButton>
        <Button variant="outline-dark" onClick={async () => { 
            loadModal.loadChart(name); 
            handleClose(); 
            //TODO: Handle bad input name
        }}>
          Load
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form.Control name="Load" as="textarea" className="font-monospace" value={name} onChange={updateName} style={{ width: '100%', height: '100%', resize: 'none' }}/>
      </Modal.Body>
      <Modal.Body>
        Existing Names:
        <Form.Control name="Load" as="textarea" className="font-monospace" value={loadModal.knownNames} style={{ width: '100%', height: '100%', resize: 'none' }} readOnly/>
      </Modal.Body>
    </Modal>
  );
}