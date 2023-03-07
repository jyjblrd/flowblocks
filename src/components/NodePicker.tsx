import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { createRef, useLayoutEffect, useState } from 'react';
import {
  Card, Col, Row, Tab, Tabs,
} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { NodeInstance } from '../shared/interfaces/NodeInstance.interface';
import { NodeGroups, NodeTypeData } from '../shared/interfaces/NodeTypes.interface';
import { nodeEditorModalAtom } from '../shared/recoil/atoms/nodeEditorModal';
import { nodeTypesAtom } from '../shared/recoil/atoms/nodeTypesAtom';
import DefaultNode from './DefaultNode';
import Draggable from './Draggable';
import ScaleToFit from './ScaleToFit';

import './NodePicker.scss';

function genDummyNodeInstance(nodeTypeId: string, nodeType: NodeTypeData): NodeInstance {
  return {
    nodeTypeId,
    connections: {},
    attributes: {},
    isInputConnected: Array<number>(Object.entries(nodeType.inputs).length).fill(0),
    isOutputConnected: Array<number>(Object.entries(nodeType.outputs).length).fill(0),
  };
}

export default function NodePicker() {
  const nodeListRef = createRef<HTMLDivElement>();
  const nodeListElementRef = createRef<HTMLDivElement>();

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedPage, setSelectedPage] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState('Input');
  const nodeTypes = Object.entries(useRecoilValue(nodeTypesAtom));
  const setNodeEditorModal = useSetRecoilState(nodeEditorModalAtom);
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const filteredItems = nodeTypes
    .filter(([, value]) => {
      if (value.group !== undefined) {
        return NodeGroups[value.group] === selectedGroup;
      } else {
        return selectedGroup === NodeGroups[NodeGroups.Other];
      }
    });
  const currentItems = filteredItems.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % nodeTypes.length;
    setSelectedPage(selectedPage + 1);
    setItemOffset(newOffset);
  };

  const createNewNode = () => {
    setNodeEditorModal({
      isOpen: true,
      nodeTypeId: undefined,
    });
  };

  const editNode = (nodeTypeId: string) => {
    setNodeEditorModal({
      isOpen: true,
      nodeTypeId,
    });
  };

  useLayoutEffect(() => {
    if (nodeListRef.current && nodeListElementRef.current) {
      setItemsPerPage(Math.floor(
        nodeListRef.current.offsetHeight / nodeListElementRef.current.offsetHeight,
      ));
    }
  }, []);

  const onTabSelect = (eventKey: any) => {
    setSelectedPage(0);
    setItemOffset(0);
    setSelectedGroup(eventKey);
  };

  return (
    <Card className="h-100 shadow-sm py-2 px-3 d-flex flex-column">
      <div style={{ overflowX: 'scroll' }} className="scrollbar">
        <Tabs
          defaultActiveKey={selectedGroup}
          justify
          className="mt-2"
          onSelect={onTabSelect}
          variant="pills"
          style={{ minWidth: '800px' }}
        >
          {Object.keys(NodeGroups)
            .filter((key: any) => !Number.isNaN(Number(NodeGroups[key]))).map((name) => (
              <Tab key={name} eventKey={name} title={name} className="mb-3" tabClassName="border border-primary" />
            ))}
        </Tabs>
      </div>

      <Row ref={nodeListRef} style={{ overflowY: 'clip' }} className="flex-grow-1 border-top">
        <Col className="d-flex flex-column" style={{ marginTop: '-10px' }}>
          {currentItems.map(([nodeTypeId, nodeType], index) => (
            <Row
              key={nodeTypeId}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...(index === 0 ? { ref: nodeListElementRef } : {})}
              className="py-3 border-bottom gx-0"
            >
              {' '}
              <Col className="py-3">
                <h5>{nodeTypeId}</h5>
                <h6
                  className="small"
                  style={{
                    height: '35px',
                  }}
                >
                  {nodeType.description}
                </h6>
              </Col>
              <Col className="my-auto">
                <div className="mx-auto" style={{ position: 'relative', width: 'fit-content' }}>
                  <Draggable id={nodeTypeId} data={{ nodeTypeId }}>
                    <ScaleToFit maxHeight={120} maxWidth={100}>
                      <DefaultNode
                        isDummyNode
                        data={genDummyNodeInstance(nodeTypeId, nodeType)}
                      />
                    </ScaleToFit>
                  </Draggable>
                </div>
              </Col>
              <Col sm="auto">
                <FontAwesomeIcon
                  icon="sliders"
                  size="sm"
                  className="text-secondary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => { editNode(nodeTypeId); }}
                />
              </Col>
            </Row>
          ))}
        </Col>
      </Row>

      <Row
        style={{ cursor: 'pointer', padding: '0 0 40px 0' }}
        onClick={createNewNode}
      >
        <Col sm="auto">
          <FontAwesomeIcon
            icon="plus"
            size="xl"
            className="text-secondary ps-2"
          />
        </Col>
        <Col>
          <h5 className="text-secondary">Create New Node</h5>
        </Col>
      </Row>

      <Row className="mt-auto mx-auto">
        <Col>
          <ReactPaginate
            breakLabel="..."
            nextLabel="›"
            onPageChange={handlePageClick}
            forcePage={selectedPage}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="‹"
            renderOnZeroPageCount={undefined}
            className="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            activeClassName="active"
          />
        </Col>
      </Row>
    </Card>
  );
}
