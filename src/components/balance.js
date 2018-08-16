import React, { Component } from 'react';
import { Card, Spin, Icon, Table } from 'antd';
import axios from 'axios';
import { translate, Trans } from 'react-i18next';
import { humanHashes } from '../Helper/statsFormat';
class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() { }
  render() {
    const walletAddressColumn = [
      {
        title: 'DeviceId',
        dataIndex: 'activeDeviceId',
        key: 'activeDeviceId'
      },
      {
        title: 'Name',
        dataIndex: 'deviceName'
      },
      {
        title: 'Hashrate',
        dataIndex: 'hashrate'
      },
      {
        title: '24Hr Hashrate',
        dataIndex: 'dayHashrate'
      }
    ];

    const { t, i18n } = this.props;

    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    }

    return (
      <Card
        title={`${t('balance.unpaid')} : ${this.props.userBalance.balance / 100000} NIM`}
        bordered={false}
        style={{ width: '85%' }}
      >
        <Table
          rowKey={record => record.activeDeviceId}
          columns={walletAddressColumn}
          dataSource={this.props.userBalance.activeDevices}
          loading={this.props.loadingBalance}
        />
        <p>
          {t('balance.devices')} :{' '}
          {this.props.userBalance.activeDevices &&
            this.props.userBalance.totalActiveDevices}{' '}
          |   {t('balance.total_hashrate')} :{' '}
          {this.props.userBalance.activeDevices &&
            humanHashes(
              this.props.userBalance.totalActiveDevicesHashrate
            )}{' '}
        </p>
      </Card>
    );
  }
}
export default translate('translations')(Balance);