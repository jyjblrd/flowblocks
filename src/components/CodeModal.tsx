import React from 'react';
import { useRecoilState } from 'recoil';
// import Modal from 'react-modal';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './CodeModal.scss';
import Prism from 'prismjs';
import Editor from 'react-simple-code-editor';
import { codeModalAtom } from '../shared/recoil/atoms/codeModalAtom';

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
      <Modal.Body style={{ height: '70vh', overflowY: 'scroll' }}>
        <Editor
          value={codeModal.code}
          onValueChange={() => {}}
          highlight={(code) => Prism.highlight(code, Prism.languages.python)}
          padding={10}
          insertSpaces={false}
          className="code-editor"
          style={{
            fontFamily: 'monospace',
            fontSize: 16,
            width: '100%',
            resize: 'none',
          }}
        />
      </Modal.Body>
    </Modal>
  );
}
