import React, { Component } from 'react';
import { Card, Spin, Icon } from 'antd';
import axios from 'axios';
import { translate, Trans } from 'react-i18next';
import { humanHashes } from '../Helper/statsFormat';
class PoolStats extends Component {
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
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    if (this.props.loading)
      return (
        <Card
          title={this.props.title}
          extra={
            <img
              alt=""
              src={this.props.flag}
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
        title={this.props.title}
        extra={
          <img
            alt=""
            src={this.props.flag}
            style={{ width: 20, padding: '16 0' }}
          />
        }
        bordered={false}
        style={{ width: '90%' }}
      >

        <p style={{marginBottom:'7px'}}>
        {t('dashboard.hashrate')} : <span> {humanHashes(this.props.pool.totalHashrate)} </span>{' '}
        </p>
        <p  style={{marginBottom:'7px'}}>
        {t('dashboard.numClients')} : <span>{this.props.pool.totalClients} </span>
        </p>
        {/* <p  style={{marginBottom:'7px'}}>
         Total Users : <span>{this.props.pool.totalUsers} </span>
        </p> */}
        <img alt="" src={this.props.poweredBy} />
      </Card>
    );
  }
}
export default translate('translations')(PoolStats);