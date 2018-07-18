import React, { Component } from 'react';
import { Icon, Spin, Layout } from 'antd';
import axios from 'axios';
import { humanHashes } from '../Helper/statsFormat';
import { translate, Trans } from 'react-i18next';
class HeaderStats extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}
  render() {
    const { t, i18n } = this.props;

    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    }
    const { Header } = Layout;
    const antIcon = (
      <Icon type="loading" style={{ fontSize: 24, color: '#fff' }} spin />
    );
    return (
      <Header className="App-header">
        <button onClick={() => changeLanguage('zh-CN')}>zh</button>
          <button onClick={() => changeLanguage('en')}>en</button>
        <div className="header-logo">
          <img
            style={{ boxShadow: '4px 5px rgba(0,0,0,0.1)', marginRight: 5 }}
            width="30"
            height="30"
            src={require('../assets/nimiq_pokedex_logo.png')}
            alt=""
          />{' '}
          NIMIQ POCKET <sup>BETA</sup>
        </div>
        <div className="header-stats">
          {this.props.isHeaderLoading ? (
            <Spin indicator={antIcon} />
          ) : (
            <p>
              <span> {humanHashes(this.props.poolStats.totalHashrate)}</span>
            </p>
          )}
          {!this.props.isHeaderLoading && (
            <p>
              FEE <span> {this.props.hk.poolFee} </span>% | FOUND{' '}
              <span>{this.props.poolStats.totalBlocksMined}</span>
              BLOCKS
            </p>
          )}{' '}
          <p className="header-payout">
          {t('title')}
            Auto Payout: Every <span>1 </span> hour for confirmed balance over{' '}
            <span>10 </span> NIM
          </p>
          <p className="header-payout">
            Pool Address: {this.props.hk.poolAddress}
          </p>
        </div>
      </Header>
    );
  }
}
export default translate('translations')(HeaderStats);