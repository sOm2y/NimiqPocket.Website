import React, { Component } from 'react';
import { Icon, Spin, Layout, Select } from 'antd';
import axios from 'axios';
import { humanHashes } from '../Helper/statsFormat';
import { translate, Trans } from 'react-i18next';
import GaugeTick from '../components/charts/speed';
const Option = Select.Option;

class HeaderStats extends Component {
  constructor(props) {
    super(props);
    this.state = { poolStats: {}, isHeaderLoading: true };
  }
  async componentDidMount() {
    axios
      .get('https://api.nimiqpocket.com:8080/api/poolstats')
      .then(poolStats => {
        this.setState({
          isHeaderLoading: false,
          poolStats: poolStats.data
        });
      });
      

    setInterval(() => {
      this.setState({
        isHeaderLoading: true
      });
      axios
        .get('https://api.nimiqpocket.com:8080/api/poolstats')
        .then(poolStats => {
          this.setState({
            isHeaderLoading: false,
            poolStats: poolStats.data
          });
        });
    }, 1000 * 60 * 1);
  }

  render() {
    const { t, i18n } = this.props;

    const handleLangChange = value => {
      i18n.changeLanguage(value);
    };
    const { Header } = Layout;
    const antIcon = (
      <Icon type="loading" style={{ fontSize: 24, color: '#fff' }} spin />
    );
    return (
      <Header className="App-header">
        <Select
          className="header-lang"
          defaultValue={
            localStorage.getItem('i18nextLng')
              ? localStorage.getItem('i18nextLng')
              : 'en'
          }
          onChange={handleLangChange}
        >
          <Option value="zh-CN">
            <img
              alt=""
              src={require('../assets/china.png')}
              style={{ width: 30 }}
            />
          </Option>
          <Option value="en">
            <img
              alt=""
              src={require('../assets//united-kingdom.png')}
              style={{ width: 30 }}
            />
          </Option>
        </Select>
        <div className="header-logo">
          <img
            style={{ boxShadow: '4px 5px rgba(0,0,0,0.1)', marginRight: 5 }}
            width="30"
            height="30"
            src={require('../assets/nimiq_pokedex_logo.png')}
            alt=""
          />{' '}
          NIMIQ POCKET <sup>Pool</sup>
        </div>
        <div className="header-stats">
         {/* <GaugeTick /> */}
          {this.state.isHeaderLoading ? (
            <Spin indicator={antIcon} />
          ) : (
            <p>
              <span> {humanHashes(this.state.poolStats.totalHashrate)}</span>
            </p>
          )}
          {!this.state.isHeaderLoading && (
            <p>
              {t('header.fee')} <span> 0 </span>% |{' '}
              {t('header.found')}{' '}
              <span>{this.state.poolStats.totalBlocksMined}</span>
              {t('header.block')}
            </p>
          )}{' '}
          <p className="header-payout">
            <Trans i18nKey="header.auto_payout">
              Auto Payout: Every <span>1 </span> hour for confirmed balance over
            </Trans>
            <span>10 </span> NIM
          </p>
        </div>
      </Header>
    );
  }
}
export default translate('translations')(HeaderStats);
