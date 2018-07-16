import React, { Component } from 'react';
import { Card, Spin, Icon } from 'antd';
import axios from 'axios';
import { humanHashes } from '../Helper/statsFormat';
export default class PoolStats extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}
  render() {
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
        <p>
          {' '}
          <span>
            {this.props.pool.poolName}:{this.props.pool.poolPort}
          </span>
        </p>
        <p>
          HashRate: <span> {humanHashes(this.props.pool.hashRate)} </span>{' '}
        </p>
        <p>
          Number Miners : <span>{this.props.pool.numClients} </span>
        </p>
        <img alt="" src={this.props.poweredBy} />
      </Card>
    );
  }
}
