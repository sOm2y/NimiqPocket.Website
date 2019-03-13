import React, { Component } from 'react';
import { Card, Icon, Tabs, Table, Badge, Spin, Row, Col } from 'antd';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import {
  ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend,
} from 'recharts';

import { withTranslation, Trans } from 'react-i18next';
import { humanHashes } from '../Helper/statsFormat';
const TabPane = Tabs.TabPane;
class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      walletAddress: '',
      payouts:{payouts:[]}
    };
  }
  componentDidMount() {
    const walletAddress = localStorage.getItem('walletAddress')
    if (walletAddress) {
      this.setState({ walletAddress: walletAddress })
      localStorage.setItem('walletAddress', walletAddress)
      axios
      .get(`https://api.nimiqpocket.com:8080/api/payout/day/${walletAddress}`)
      .then(res => {
        this.setState({
          payouts: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
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
        render: lastUpdate => <a>{moment(lastUpdate).fromNow()}</a>,
      }
    ];

    const payoutsColumn = [
      {
        title: 'Date',
        dataIndex: 'datetime',
        render: datetime => moment(datetime).format('Do MMMM YYYY, h:mm:ss a')
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        render: amount => `${amount / 100000} NIM`
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

    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


    return (
      <Card
        title={this.props.loadingBalance ? <Spin indicator={antIcon} /> : `${t('balance.unpaid')} : ${this.props.userBalance.balance / 100000} NIM | Wallet Address : ${this.props.walletAddress}`}
        bordered={false}
        style={{ width: '85%' }}
        extra={this.props.walletAddress && <a onClick={() => { this.props.fetchBalance(this.props.walletAddress) }}><Icon type="reload" /> refresh</a>}
      >
        <Tabs type="card">
          <TabPane tab={<span>Active devices <Badge count={this.props.devices.activeDevices && this.props.devices.activeDevices.length} overflowCount={999} style={{ backgroundColor: '#52c41a', fontSize: 12, top: "-2px", left: "3px" }} /></span>} key="1" >
            <Table
              rowKey={record => record.deviceId}
              columns={walletAddressColumn}
              dataSource={this.props.devices.activeDevices}
              loading={this.props.loadingBalance}
            /></TabPane>
          <TabPane tab={<span>Inactive devices <Badge count={this.props.inactiveDevices.inactiveDevices && this.props.inactiveDevices.inactiveDevices.length} overflowCount={999} style={{ fontSize: 12, top: "-2px", left: "3px" }} /></span>} key="2">
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
          <TabPane tab={<span>Statistics <Badge count="new" overflowCount={999} style={{ fontSize: 10, top: "-3px", left: "3px" }} /></span>}  key="4">
            <Row>
              <ComposedChart
                  width={800}
                  height={400}
                  data={this.state.payouts.payouts}
                  margin={{
                    top: 20, right: 20, bottom: 20, left: 20,
                  }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="datetime" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar name="Transactions per day" yAxisId="left" dataKey="transaction_total" barSize={20} fill="#a557ff" />
                  <Line name="Amounts per day" yAxisId="right" type="monotone" dataKey="amount_total" stroke="#ff7300" />
                </ComposedChart>
            </Row>
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
