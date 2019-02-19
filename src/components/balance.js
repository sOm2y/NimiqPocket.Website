import React, { Component } from 'react';
import { Card, Spin, Tabs, Table } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { withTranslation, Trans } from 'react-i18next';
import { humanHashes } from '../Helper/statsFormat';
const TabPane = Tabs.TabPane;
class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      walletAddress:''
    };
  }
  async componentDidMount() {
    const walletAddress = localStorage.getItem('walletAddress')
    if (walletAddress) {
      this.setState({ walletAddress: walletAddress })
    }
  }
  render() {
    const walletAddressColumn = [
      {
        title: 'DeviceId',
        dataIndex: 'deviceId',
        key: 'deviceId'
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
      },
      {
        title: 'Last Update',
        dataIndex: 'lastUpdate',
        render: lastUpdate => <a>{ moment(lastUpdate).fromNow()}</a>,
      }
    ];

    const payoutsColumn = [
      {
        title: 'Date',
        dataIndex: 'datetime',
        render: datetime =>  moment(datetime).format('Do MMMM YYYY, h:mm:ss a')
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        render: amount => `${amount/100000} NIM`
      },
      {
        title: 'Transaction',
        dataIndex: 'transaction',
        render: transaction => <a href={`https://nimiq.watch/#${transaction}`} target='_blank'>{transaction}</a>,
      }
    ];

    const { t, i18n } = this.props;

    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    }

    return (
      <Card
        title={`${t('balance.unpaid')} : ${this.props.userBalance.balance / 100000} NIM | Wallet Address : ${this.state.walletAddress}`}
        bordered={false}
        style={{ width: '85%' }}
      >
        <Tabs type="card">
          <TabPane tab="Online Miners" key="1" >
          <Table
            rowKey={record => record.deviceId}
            columns={walletAddressColumn}
            dataSource={this.props.devices.activeDevices}
            loading={this.props.loadingBalance}
          /></TabPane>
          <TabPane tab="Offline Miners" key="2">
          <Table
            rowKey={record => record.deviceId}
            columns={walletAddressColumn}
            dataSource={this.props.inactiveDevices.inactiveDevices}
            loading={this.props.loadingBalance}
          /></TabPane>
          <TabPane tab="Payout Transactions" key="3">
          <Table
            rowKey={record => record.transaction}
            columns={payoutsColumn}
            dataSource={this.props.payouts.payouts}
            loading={this.props.loadingBalance}
          />
          </TabPane>
          <TabPane tab="Statistics" key="4">
            COMING SOON
          </TabPane>

        </Tabs>

        <p>
          {t('balance.devices')} :{' '}
          {this.props.devices.activeDevices &&
            this.props.devices.activeDevices.length}{' '}
          |   {t('balance.total_hashrate')} :{' '}
          {this.props.devices.activeDevices &&
            humanHashes(
              this.props.devices.totalHashrate
            )}{' '}
        </p>
      </Card>
    );
  }
}
export default withTranslation('translations')(Balance);
