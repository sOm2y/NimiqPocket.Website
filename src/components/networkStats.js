import React, { Component } from 'react';
import { Card, Spin, Icon } from 'antd';
import { translate, Trans } from 'react-i18next';
import axios from 'axios';
import { humanHashes } from '../Helper/statsFormat';
class NetworkStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNetworkStatsLoading: true,
      networkStats: {},
      price:{}
    };
  }
  async componentDidMount() {
    try {
      const [networkStats] = await Promise.all([
        axios.get('https://us.nimiqpocket.com:5656/api/networkstats'),
      ]);

      this.setState({
        isNetworkStatsLoading: false,
        networkStats: networkStats.data,
      });
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    const { t, i18n } = this.props;

    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    }
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    if (this.state.isNetworkStatsLoading)
      return (
        <Card
          title={t('dashboard.network.title')}
          bordered={false}
          style={{ width: '90%' }}
        >
           <Spin indicator={antIcon} />
        </Card>
      );
    return (
      <Card
        title=  {t('dashboard.network.title')}
        extra={<p>Power by <a href="https://api.nimiqx.com/" target="_blank">NimiqX</a></p>}
        bordered={false}
        style={{ width: '90%' }}
        className='network-stats'
      >
        <p>
        {t('dashboard.hashrate')} :{' '}
          <span> {humanHashes(this.state.networkStats.hashrate)} </span>{' '}
        </p>
        <p>
        {t('dashboard.network.height')} : <span>{this.state.networkStats.height} </span>
        </p>
        <p>
        {t('dashboard.network.difficulty')} : <span>{this.state.networkStats.difficulty} </span>
        </p>
        <p>
          1KH/s: <span>{this.state.networkStats.nim_day_kh} NIM </span>  {t('dashboard.network.per_day')} 
        </p>

      </Card>
    );
  }
}
export default translate('translations')(NetworkStats);