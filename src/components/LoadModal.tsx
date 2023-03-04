import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
// import Modal from 'react-modal';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form, Card } from 'react-bootstrap';
import { loadModalAtom } from '../shared/recoil/atoms/loadModalAtom';
import './LoadModal.scss';

export default function LoadModal() {
  const [loadModal, setLoadModal] = useRecoilState(loadModalAtom);
  const [name, setName] = useState('default');
  const handleClose = () => setLoadModal((prevLoadModal) => ({ ...prevLoadModal, isOpen: false }));

  const updateName = (event: any) => {
    const target = event.target as HTMLInputElement;
    setName(target.value);
  };

  const loadChart = async () => {
    if (name === '' || name == null) {
      alert('Please enter a name');
    } else {
      loadModal.loadChart(name);
      handleClose();
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      loadChart();
    }
  };

  // Change dialogClassName
  return (
    <Modal animation={false} show={loadModal.isOpen} onHide={handleClose} dialogClassName="default">
      <Modal.Header closeButton>
        <Button
          variant="outline-dark"
          onClick={() => { loadChart(); }}
        >
          Load
        </Button>
      </Modal.Header>
      <Modal.Body>
        <h5>File name to load in</h5>
        <Form.Control name="nodeTypeId" className="mb-3" onChange={updateName} value={name} placeholder="Name" onKeyDown={handleKeyDown} />
        <h5>Existing files</h5>
        <Card className="shadow p-3 pe-1">
          <div style={{ overflowY: 'scroll', overflowX: 'hidden', minHeight: '120px' }}>
            {
                        loadModal.knownNames.map((l: string) => (
                          <div style={{ cursor: 'pointer' }} key={l}>
                            <h5 onClick={() => setName(l)}>{l}</h5>
                          </div>
                        ))
                    }
          </div>
        </Card>
        {/* <Form.Control name="description" className="mt-2" size="sm" as="textarea" rows={2} value={loadModal.knownNames} placeholder="Description" /> */}
      </Modal.Body>
      {/* <Modal.Body>
        <Form.Control name="Load" as="textarea" className="font-monospace" value={name} onChange={updateName} style={{ width: '100%', height: '100%', resize: 'none' }} />
      </Modal.Body>
      <Modal.Body>
        Existing Names:
        <Form.Control name="Load" as="textarea" className="font-monospace" value={loadModal.knownNames} style={{ width: '100%', height: '100%', resize: 'none' }} readOnly />
      </Modal.Body> */}
    </Modal>
  );
}
