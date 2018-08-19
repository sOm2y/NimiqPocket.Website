import React, { Component } from 'react';
import { Card, Spin, Tabs, Table } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { translate, Trans } from 'react-i18next';
import { humanHashes } from '../Helper/statsFormat';
const TabPane = Tabs.TabPane;

moment.locale('zh-cn');

class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {

  }
  render() {
    const walletAddressColumn = [
      {
        title: '矿机ID',
        dataIndex: 'deviceId',
        key: 'deviceId'
      },
      {
        title: '矿机名称',
        dataIndex: 'deviceName'
      },
      {
        title: 'Hashrate',
        dataIndex: 'hashrate'
      },
      {
        title: '24Hr Hashrate',
        dataIndex: 'dayHashrate'
      },
      {
        title: '上次更新',
        dataIndex: 'lastUpdate',
        render: lastUpdate => <a>{ moment(lastUpdate).fromNow()}</a>,
      }
    ];
    const offlineColumn = [
      {
        title: '矿机ID',
        dataIndex: 'deviceId',
        key: 'deviceId'
      },
      {
        title: '矿机名称',
        dataIndex: 'deviceName'
      },
      // {
      //   title: 'Hashrate',
      //   dataIndex: 'hashrate'
      // },
      // {
      //   title: '24Hr Hashrate',
      //   dataIndex: 'dayHashrate'
      // },
      // {
      //   title: '上次更新',
      //   dataIndex: 'lastUpdate',
      //   render: lastUpdate => <a>{ moment(lastUpdate).fromNow()}</a>,
      // }
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
        <Tabs type="card">
          <TabPane tab="在线矿机" key="1" >
          <Table
            rowKey={record => record.deviceId}
            columns={walletAddressColumn}
            dataSource={this.props.devices.activeDevices}
            loading={this.props.loadingBalance}
          /></TabPane>
          <TabPane tab="掉线矿机" key="2">
          <Table
            rowKey={record => record.deviceId}
            columns={offlineColumn}
            dataSource={this.props.devices.inactiveDevices}
            loading={this.props.loadingBalance}
          /></TabPane>
          <TabPane tab="转账纪录" key="3">
            Coming soon
          </TabPane>

        </Tabs>

        <p>
          {t('balance.devices')} :{' '}
          {this.props.devices.activeDevices &&
            this.props.devices.totalActiveDevices}{' '}
          |   {t('balance.total_hashrate')} :{' '}
          {this.props.devices.activeDevices &&
            humanHashes(
              this.props.devices.totalActiveDevicesHashrate
            )}{' '}
        </p>
      </Card>
    );
  }
}
export default translate('translations')(Balance);