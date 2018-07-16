import React, { Component } from 'react';
import { Card, Spin, Icon } from 'antd';
import axios from 'axios';
import { humanHashes } from '../Helper/statsFormat';
export default class NetworkStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNetworkStatsLoading: true,
      networkStats: {}
    };
  }
  async componentDidMount() {
    try {
      const [networkStats] = await Promise.all([
        axios.get('https://kr.nimiqpocket.com:5656/api/networkstats')
      ]);

      this.setState({
        isNetworkStatsLoading: false,
        networkStats: networkStats.data
      });
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    if (this.state.isNetworkStatsLoading)
      return (
        <Card
          title="Nimiq network stats"
          extra={
            <img
              alt=""
              // src={require('./assets/if_Korea-South_298472.png')}
              style={{ width: 20, padding: '16 0' }}
            />
          }
          bordered={false}
          style={{ width: '90%' }}
        >
           <Spin indicator={antIcon} />
        </Card>
      );
    return (
      <Card
        title="Nimiq network stats"
        extra={
          <img
            alt=""
            // src={require('./assets/if_Korea-South_298472.png')}
            style={{ width: 20, padding: '16 0' }}
          />
        }
        bordered={false}
        style={{ width: '90%' }}
      >
        <p>
          HashRate:{' '}
          <span> {humanHashes(this.state.networkStats.hashrate)} </span>{' '}
        </p>
        <p>
          Height : <span>{this.state.networkStats.height} </span>
        </p>
        <p>
          Difficulty : <span>{this.state.networkStats.difficulty} </span>
        </p>
        <p>
          1KH/s: <span>{this.state.networkStats.nim_day_kh} </span>per day
        </p>
      </Card>
    );
  }
}
