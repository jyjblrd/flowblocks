import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEventHandler, RefObject, useRef } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { AttributeTypes } from '../../shared/interfaces/NodeTypes.interface';

export default function NodeEditorModal(
  {
    name, type, deleteItem, onChange, isActive,
  }:
  {
    name: string,
    type: AttributeTypes,
    deleteItem: (name: string) => void,
    onChange: ChangeEventHandler,
    isActive: boolean
  },
) {
  return (
    <Row className="gx-2 pb-2">
      <Col xs={7} md={4} lg={5} xxl={6}>
        <Form.Control autoFocus={isActive} size="sm" placeholder="Attribute Name" name="attributeName" data-attribute-name={name} value={name} onChange={onChange} />
      </Col>
      <Col>
        <Form.Select size="sm" name="attributeType" value={AttributeTypes[type]} data-attribute-name={name} onChange={onChange}>
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
      <Col xs="auto">
        <FontAwesomeIcon
          icon="trash-can"
          className="text-secondary ps-1 pe-3 my-auto"
          style={{ paddingTop: '6px', cursor: 'pointer' }}
          onClick={() => deleteItem(name)}
        />
      </Col>
    </Row>
  );
}
