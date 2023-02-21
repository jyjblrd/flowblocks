import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import CodeModal from './components/CodeModal';
import FlowBuilder from './components/FlowBuilder';
import NodePicker from './components/NodePicker';
import Toolbar from './components/Toolbar';

export default function App() {
  return (
    <>
      <Container fluid className="main-container">
        <Row className="mt-4 mb-2">
          <Col className="ms-4">
            <h2>Flow Blocks</h2>
          </Col>
          <Col>
            <Toolbar />
          </Col>
        </Row>
        <Row>
          <Col xs={5} md={4} xl={2}>
            <NodePicker />
          </Col>
          <Col>
            <FlowBuilder />
          </Col>
        </Row>
      </Container>
      <CodeModal />
    </>
  );
}
