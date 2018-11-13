import React from 'react';
import Table from 'antd/lib/table';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { MAP_COUNTRY_DATA } from '../queries';

require('antd/lib/table/style/css');
require('antd/lib/input/style/css');
require('antd/lib/button/style/css');
require('antd/lib/icon/style/css');

const BuyNowButton = ({ record, handleCityClick }) => (
  <button type="button" onClick={() => handleCityClick(record)}>
    Add To card
  </button>
);

BuyNowButton.propTypes = {
  record: PropTypes.shape({}).isRequired,
  handleCityClick: PropTypes.func.isRequired,
};

class Filter extends React.Component {
  state = {
    searchText: '',
  };

  handleSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleSelection = (country) => {
    const { addToCart } = this.props;
    addToCart(country);
  };

  render() {
    const { handleCityClick, cities } = this.props;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',

        sorter: (a, b) => a.name - b.name,
        filterDropdown: ({
          setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
          <div className="custom-filter-dropdown">
            <Input
              // eslint-disable-next-line
              ref={ele => (this.searchInput = ele)}
              placeholder="Search name"
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={this.handleSearch(selectedKeys, confirm)}
            />
            <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>
              Search
            </Button>
            <Button onClick={this.handleReset(clearFilters)}>Reset</Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />
        ),
        onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            });
          }
        },
        render: (text, record) => {
          const { searchText } = this.state;
          return searchText ? (
            <span
              role="button"
              tabIndex={0}
              data-testid="filterComponent"
              onClick={() => this.handleSelection(record)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  this.handleSelection(record);
                }
              }}
              // onMouseOver={() => handleCityClick(record)}
              // onFocus={() => handleCityClick(record)}
            >
              {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map(
                (fragment, i) => (fragment.toLowerCase() === searchText.toLowerCase() ? (
                  <span
                      // eslint-disable-next-line
                      key={i}
                    className="highlight"
                  >
                    {fragment}
                  </span>
                ) : (
                  fragment
                )),
              )}
              {!record.sold
                && record.countryId
                && record.mapIndex && (
                  <BuyNowButton record={record} handleCityClick={handleCityClick} />
              )}
            </span>
          ) : (
            <span
              role="button"
              tabIndex={0}
              onClick={() => this.handleSelection(record)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  this.handleSelection(record);
                }
              }}
              // onMouseOver={() => handleCityClick(record)}
              // onFocus={() => handleCityClick(record)}
            >
              {text}
              {!record.sold && <BuyNowButton record={record} handleCityClick={handleCityClick} />}
            </span>
          );
        },
      },
      {
        title: 'Plots',
        dataIndex: 'plots',
        key: 'plots',
        sorter: (a, b) => a.plots - b.plots,
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        sorter: (a, b) => a.price - b.price,
      },
      {
        title: 'ROI',
        dataIndex: 'roi',
        key: 'roi',
        sorter: (a, b) => a.roi - b.roi,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={cities}
        onRow={record => ({
          onClick: () => handleCityClick(record),
        })}
      />
    );
  }
}

const EnhancedFilter = props => (
  <Query query={MAP_COUNTRY_DATA} pollInterval={500}>
    {({
      data,
      // , error, loading
    }) => (
      // console.log('props.picked[0].country', props.picked[0].country);
      // console.log('data.userId', data.userId);
      <Filter cities={data && data.mapCountries} {...props} />
    )}
  </Query>
);

export default EnhancedFilter;

Filter.propTypes = {
  addToCart: PropTypes.func.isRequired,
  cities: PropTypes.shape({}).isRequired,
  handleCityClick: PropTypes.func.isRequired,
};
