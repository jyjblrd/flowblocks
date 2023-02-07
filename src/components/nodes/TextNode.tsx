import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

function TextNode(props) {
  console.log(props);
  const { xPos } = props;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="text-3xl font-bold underline">
        {xPos}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
    </>
  );
}

TextNode.propTypes = {
  xPos: PropTypes.number.isRequired,
};

export default TextNode;
