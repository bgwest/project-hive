import React from 'react';
import posed from 'react-pose';
import PropTypes from 'prop-types';

// style
import './block.scss';

// for making box go transparent and apparent
// const Box = posed.div({
//   hidden: { opacity: 0 },
//   visible: { opacity: 5 },
// });

// come up with a cool disable/enable switch
// this will render in dashboard...
// once you are logged in, you can use this switch to
// toggle on and off the system. access code will only be needed
// if you don't want to login...
// make this component change to green and flash "armed' when dragged to -100% left
// and when it is dragged to right 100% then turn it red and flash 'disarm'
const Box = posed.div({
  hoverable: true,
  draggable: 'x',
  dragBounds: { left: '-100%', right: '100%' },
  init: { scale: 1 },
  hover: { scale: 1.2 },
  drag: { scale: 1.1 },
});

class Block extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: true };
    this.state.text = 'Slide left to enable';
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      const project = 'Slide left to enable';
      const hive = 'Slide right to disable';
      // flashing letters ooo cool...
      switch (this.state.text) {
        case project:
          this.setState({
            isVisible: !this.state.isVisible,
            text: hive,
          });
          return;
        case hive:
          this.setState({
            isVisible: !this.state.isVisible,
            text: project,
          });
          
        default:
      }
    }, 2000);
  }

  // fixed memory leak in my application from the <Block/> setInterval used on the slider text
  componentWillUnmount() {
    clearInterval(this.timer);
  }


  render() {
    const { isVisible, text } = this.state;
    return (<div>
        <Box className="box" pose={isVisible ? 'visible' : 'hidden'}>{text}</Box>
      </div>
    );
  }
}

Block.propTypes = {
  location: PropTypes.object,
};

export default Block;
