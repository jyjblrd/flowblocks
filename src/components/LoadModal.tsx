import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
// import Modal from 'react-modal';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {
  Form, Card, Col, Row,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { loadModalAtom } from '../shared/recoil/atoms/loadModalAtom';
import './LoadModal.scss';
import { getDeleteFlowInstance } from '../shared/helpers/helperFunctions';

export default function LoadModal() {
  const [loadModal, setLoadModal] = useRecoilState(loadModalAtom);
  const [name, setName] = useState('');
  const [showError, setShowError] = useState(0);
  const handleClose = () => setLoadModal((prevLoadModal) => ({ ...prevLoadModal, isOpen: false }));

  const updateName = (event: any) => {
    const target = event.target as HTMLInputElement;
    setName(target.value);
    setShowError(0);
  };

  const loadChart = async () => {
    if (name === '' || name == null) {
      setShowError(1);
    } else if (loadModal.knownNames.includes(name)) {
      loadModal.loadChart(name);
      handleClose();
    } else {
      setShowError(2);
    }
  };

  const deleteSavedChart = (givenName: string) => {
    const gotNames = getDeleteFlowInstance(givenName);
    setLoadModal((prevLoadModal) => ({
      ...prevLoadModal,
      knownNames: gotNames,
    }));
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
        <div>
          <h5 style={{ color: 'red', marginTop: '5px', display: 'block' }}>
            {showError ? ((showError - 1) ? 'No saved flowchart found of this name' : 'Please enter a name') : ''}
          </h5>
        </div>
        <h5>Existing files</h5>
        <Card className="shadow p-3 pe-1">
          <div style={{ overflowY: 'scroll', overflowX: 'hidden', minHeight: '120px' }}>
            {
              loadModal.knownNames.map((l: string) => (
                <div key={l}>
                  <Row>

                    <Col>
                      <div style={{ cursor: 'pointer' }}>
                        <h5 onClick={() => setName(l)}>{l}</h5>
                      </div>
                    </Col>
                    <Col xs="auto" margin-right="0">
                      <FontAwesomeIcon
                        icon="trash-can"
                        className="text-secondary ps-1 pe-3 my-auto"
                        style={{ paddingTop: '6px', cursor: 'pointer' }}
                        onClick={() => deleteSavedChart(l)}
                      />
                    </Col>

                  </Row>
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
