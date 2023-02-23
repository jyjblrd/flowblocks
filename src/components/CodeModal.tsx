import React from 'react';
import { useRecoilState } from 'recoil';
// import Modal from 'react-modal';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { codeModalAtom } from '../shared/recoil/atoms/codeModalAtom';
import './CodeModal.scss';

export default function CodeModal() {
  const [codeModal, setCodeModal] = useRecoilState(codeModalAtom);

  const handleClose = () => setCodeModal((prevCodeModal) => ({ ...prevCodeModal, isOpen: false }));

  return (
    <Modal animation={false} show={codeModal.isOpen} onHide={handleClose} dialogClassName="code-modal">
      <Modal.Header closeButton>
        <Button variant="outline-dark" onClick={async () => { await navigator.clipboard.writeText(codeModal.code); }}>
          Copy to clipboard
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form.Control as="textarea" className="font-monospace" value={codeModal.code} style={{ width: '100%', height: '100%', resize: 'none' }} readOnly />
      </Modal.Body>
    </Modal>
  );
}
