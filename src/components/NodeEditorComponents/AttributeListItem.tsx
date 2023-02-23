import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { AttributeTypes } from '../../shared/interfaces/NodeTypes.interface';

export default function NodeEditorModal(
  { name, type }: { name: string, type: AttributeTypes },
) {
  return (
    <Row className="gx-2 pb-2">
      <Col xs={7}>
        <Form.Control size="sm" placeholder="Attribute Name" defaultValue={name} />
      </Col>
      <Col>
        <Form.Select size="sm" defaultValue={AttributeTypes[type]}>
          <option value="">Type</option>
          {
            Object.keys(AttributeTypes)
              .filter((key: any) => !Number.isNaN(Number(AttributeTypes[key])))
              .map((attributeType) => (
                <option key={attributeType} value={attributeType}>
                  {attributeType}
                </option>
              ))
          }
        </Form.Select>
      </Col>
    </Row>
  );
}
