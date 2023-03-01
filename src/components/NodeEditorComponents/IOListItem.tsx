import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { ConnectionType } from '../../shared/interfaces/NodeTypes.interface';

export default function IOListItem(
  {
    isInput = false, name, type, id, deleteItem,
  }:
  {
    isInput?: boolean,
    name: string,
    type: ConnectionType,
    id: string,
    deleteItem: (id: string) => void
  },
) {
  return (
    <Row className="gx-2 pb-2">
      <Col xs={7} md={4} lg={5} xxl={6}>
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
      <Col xs="auto">
        <FontAwesomeIcon
          icon="trash-can"
          className="text-secondary ps-1 pe-3 my-auto"
          style={{ paddingTop: '6px', cursor: 'pointer' }}
          onClick={() => deleteItem(id)}
        />
      </Col>
    </Row>
  );
}
