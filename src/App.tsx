import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import CodeModal from './components/CodeModal';
import FlowBuilder from './components/FlowBuilder';
import NodePicker from './components/NodePicker';
import Toolbar from './components/Toolbar';
import NodeEditorModal from './components/NodeEditorComponents/NodeEditorModal';
import SaveModal from './components/SaveModal';
import LoadModal from './components/LoadModal';
import NotificationToasts from './components/NotificationToasts';
// TODO: make these imports a bit nicer

library.add(fas, fab);

export default function App() {
  return (
    <>
      <NotificationToasts />
      <Container fluid className="main-container">
        <Row className="mt-4 mb-2 flex-nowrap">
          <Col className="ms-4" style={{ width: 'fit-content' }} md="auto">
            <h2>Flow Blocks</h2>
          </Col>
          <Col>
            <Toolbar />
          </Col>
        </Row>
        <Row style={{ height: 'calc(100vh - 100px)' }}>
          <Col xs={6} md={6} xl={4} className="h-100">
            <NodePicker />
          </Col>
          <Col>
            <FlowBuilder />
          </Col>
        </Row>
      </Container>
      <CodeModal />
      <SaveModal />
      <LoadModal />
      <NodeEditorModal />
    </>
  );
}
