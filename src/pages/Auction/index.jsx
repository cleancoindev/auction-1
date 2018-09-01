import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AuctionImage from '../../components/AuctionImage';
import AuctionBox from '../../components/AuctionBox';
import DescriptionBox from '../../components/DescriptionBox/index';
import FAQ from '../../components/FAQ';
import MailingList from '../../components/MailingList';
import './animations.css';
import rockBackground from '../../images/rockBackground.png';

const OverlapOnDesktopView = styled.div`
  @media (min-width: 64em) {
    position: absolute;
    bottom: 1em;
    left: 5em;
  }
`;

const RockOverlay = styled.div`
  background-image: url(${rockBackground});
  background-repeat: repeat;
  background-size: contain;
`;

const TopHighlight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
`;

const Auction = ({
  currentPrice,
  minPrice,
  maxPrice,
  level,
  grade,
  rate,
  buyNow,
  deadline,
  name,
  tokenId,
  redirectTo,
  showConfirm
}) => (
    <div className="bg-off-black ">
      <RockOverlay>
        <div className="relative mw9 center">
          <AuctionImage />
          <ReactCSSTransitionGroup
            transitionName="example"
            transitionAppear
            transitionAppearTimeout={5000}
            transitionEnterTimeout={5000}
            transitionLeaveTimeout={5000}
          >
            <AuctionBox
              currentPrice={currentPrice}
              minPrice={minPrice}
              maxPrice={maxPrice}
              deadline={deadline}
              handleBuyNow={buyNow}
              level={level}
              grade={grade}
              rate={rate}
              name={name}
              tokenId={tokenId}
              redirectTo={redirectTo}
              showConfirm={showConfirm}
            />
          </ReactCSSTransitionGroup>
        </div>
      </RockOverlay>
      <div className="bg-off-black">
        <TopHighlight />
        <div className="mw9 center relative-l">
          <DescriptionBox level={level} grade={grade} rate={rate} />
          <div className="w-50-l measure-wide-l">
            <OverlapOnDesktopView>
              <FAQ />
            </OverlapOnDesktopView>
          </div>
        </div>
      </div>
      <MailingList />
    </div>
  );


export default Auction;

Auction.propTypes = {
  deadline: PropTypes.instanceOf(Date).isRequired,
  currentPrice: PropTypes.number.isRequired,
  minPrice: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired,
  grade: PropTypes.string.isRequired,
  rate: PropTypes.number.isRequired,
  buyNow: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  showConfirm: PropTypes.bool.isRequired,
  tokenId: PropTypes.string.isRequired,
  redirectTo: PropTypes.string.isRequired,
};