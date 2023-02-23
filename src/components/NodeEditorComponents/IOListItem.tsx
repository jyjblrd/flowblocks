import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { ConnectionType } from '../../shared/interfaces/NodeTypes.interface';

export default function IOListItem(
  { isInput = false, name, type }: { isInput?: boolean, name: string, type: ConnectionType },
) {
  return (
    <Row className="gx-2 pb-2">
      <Col xs={7}>
        <Form.Control size="sm" placeholder={isInput ? 'Input Name' : 'Output Name'} defaultValue={name} />
      </Col>
      <Col>
        <Form.Select size="sm" defaultValue={ConnectionType[type]}>
          <option value="">Type</option>
          {
            Object.keys(ConnectionType)
              .filter((key: any) => !Number.isNaN(Number(ConnectionType[key])))
              .map((connectionType) => (
                <option key={connectionType} value={connectionType}>
                  {connectionType}
                </option>
              ))
          }
        </Form.Select>
      </Col>
    </Row>
  );
}
