import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ProgressMeter extends PureComponent {
  static propTypes = {
    currentPrice: PropTypes.number.isRequired
  };

  render() {
    let { currentPrice, minPrice, maxPrice } = this.props;
    return (
      <div className="bg-off-black white ma0 pa3 tc">
        <p>Ξ {currentPrice}</p>
        <progress value="22" max="100" className="w-100" />
        <div className="flex jcb">
          <small>Ξ {minPrice}</small>
          <small>Ξ {maxPrice}</small>
        </div>
      </div>
    );
  }
}

export default ProgressMeter;
