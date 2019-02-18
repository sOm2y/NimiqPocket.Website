import React, { Component } from 'react';
import { Card, Icon, List, BackTop, Button, Spin, Radio, Row } from 'antd';
import axios from 'axios';
import { getTransactionsData } from '../services/service';
import { withTranslation, Trans } from 'react-i18next';
import moment from 'moment';
import { humanHashes } from '../Helper/statsFormat';
class blocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadingMore: false,
      showLoadingMore: true,
      limit: 10,
      skip: 0,
      limitPayout: 10,
      skipPayout: 0,
      blocks: [],
      payouts: [],
      showList: 'blocks',
      isBlocksEnd: false,
      isPayoutsEnd: false
    };
  }
  async componentDidMount() {
    try {
      const [blocks, transactions] = await Promise.all([
        axios.get(
          `https://api.nimiqpocket.com:8080/api/blocks/NQ37%2047US%20CL1J%20M0KQ%20KEY3%20YQ4G%20KGHC%20VPVF%208L02/${
            this.state.limit
          }/${this.state.skip}`
        ),
        axios.get(
          `https://api.nimiqpocket.com:8080/api/transactions/NQ37%2047US%20CL1J%20M0KQ%20KEY3%20YQ4G%20KGHC%20VPVF%208L02/${
            this.state.limitPayout
          }/${this.state.skipPayout}`
        )
      ]);
      let skip = this.state.skipPayout + this.state.limitPayout;
      let skipPayout = this.state.skip + this.state.limit;

      this.setState({
        loading: false,
        blocks: blocks.data,
        transactions: transactions.data,
        skipPayout: skipPayout ,
        skip: skip 
      });
    } catch (e) {
      console.log(e);
    }
  }
  onLoadMore = () => {
    this.setState({
      loadingMore: true
    });
    if (this.state.showList === 'blocks') {
      let currentSkip = this.state.skip + this.state.limit;
      this.setState({ skip: currentSkip });
      getTransactionsData(
        this.state.showList,
        this.state.limit,
        this.state.skip
      ).then(res => {
        const blocks = this.state.blocks.concat(res);
        if (res.length < 10) {
          this.setState({ isBlocksEnd: true });
        }
        this.setState(
          {
            blocks,
            loadingMore: false
          },
          () => {
            // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
            // In real scene, you can using public method of react-virtualized:
            // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
            window.dispatchEvent(new Event('resize'));
          }
        );
      });
    } else {
      let currentSkip = this.state.skipPayout + this.state.limitPayout;
      this.setState({ skipPayout: currentSkip });
      getTransactionsData(
        this.state.showList,
        this.state.limitPayout,
        this.state.skipPayout
      ).then(res => {
        const transactions = this.state.transactions.concat(res);
        if (res.length < 10) {
          this.setState({ isPayoutsEnd: true });
        }
        this.setState(
          {
            transactions,
            loadingMore: false
          },
          () => {
            // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
            // In real scene, you can using public method of react-virtualized:
            // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
            window.dispatchEvent(new Event('resize'));
          }
        );
      });
    }
  };

  onChange = e => {
    this.setState({ showList: e.target.value });
  };
  render() {
    const { t, i18n } = this.props;

    const changeLanguage = lng => {
      i18n.changeLanguage(lng);
    };
    const {
      loading,
      loadingMore,
      showLoadingMore,
      blocks,
      transactions
    } = this.state;
    const loadMore = showLoadingMore ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 60,
          height: 32,
          lineHeight: '32px'
        }}
      >
        {loadingMore && <Spin />}
        {!loadingMore && (
          <Button disabled={this.state.isBlocksEnd} onClick={this.onLoadMore}>
            loading more
          </Button>
        )}
      </div>
    ) : null;

    const loadMorePayouts = showLoadingMore ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 60,
          height: 32,
          lineHeight: '32px'
        }}
      >
        {loadingMore && <Spin />}
        {!loadingMore && (
          <Button disabled={this.state.isPayoutsEnd} onClick={this.onLoadMore}>
            loading more
          </Button>
        )}
      </div>
    ) : null;
    return (
      <div>  
        <BackTop />
        <Row style={{ textAlign: 'center', paddingTop: '40px' }}>
          <Radio.Group
            defaultValue={this.state.showList}
            onChange={this.onChange}
          >
            <Radio.Button value="blocks">Blocks</Radio.Button>
            <Radio.Button value="transactions">Payouts</Radio.Button>
          </Radio.Group>
        </Row>
        {this.state.showList === 'blocks' && (
          <List
            loading={loading}
            //   itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={blocks}
            renderItem={item => (
              <Card
                title={`Mined Block #${item.height}`}
                bordered={false}
                style={{ width: '100%', maxWidth: '600px' }}
              >
                <List.Item>
                  <List.Item.Meta
                    title={`${item.miner_address}`}
                    description={`${moment
                      .unix(item.timestamp)
                      .format('Do MMMM YYYY, h:mm:ss a')} `}
                  />
                  <div style={{ color: 'green' }}>
                    + {item.reward / 100000} NIM
                  </div>
                </List.Item>
              </Card>
            )}
          />
        )}
        {this.state.showList === 'transactions' && (
          <List
            loading={loading}
            //   itemLayout="horizontal"
            loadMore={loadMorePayouts}
            dataSource={transactions}
            renderItem={item => (
              <Card
                title={`Transaction #${item.height}`}
                bordered={false}
                style={{ width: '100%', maxWidth: '600px' }}
              >
                <List.Item>
                  <List.Item.Meta
                    title={`To: ${item.to_address}`}
                    description={`${moment
                      .unix(item.timestamp)
                      .format('Do MMMM YYYY, h:mm:ss a')} `}
                  />
                  <div style={{ color: 'red' }}>
                    - {item.value / 100000} NIM
                  </div>
                </List.Item>
              </Card>
            )}
          />
        )}
      </div>
    );
  }
}
export default withTranslation('translations')(blocks);
