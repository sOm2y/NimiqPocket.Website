import React, { Component } from 'react';
import { Card, Spin, Icon, Table, Collapse } from 'antd';
import axios from 'axios';
import { translate, Trans } from 'react-i18next';
import { humanHashes } from '../Helper/statsFormat';
const Panel = Collapse.Panel;
const pplns = `
  Nimiqpocket pool is running PPLNS. PPLNS stands for Pay Per Last (luck) N Shares. 
  This method calculates your payments based on the number of shares you submitted during a shift. 
  It includes shift system which is time based or by number of shares submitted by the miners on the pool. 
  Your pool may find blocks consistently or in overtime it may have huge variations in winning a block and that ultimately affects your payments. 
  PPLNS greatly involves luck factor and you’ll notice huge fluctuations in your 24 hour payout. 
  If you maintain your mining on a single pool then your payouts will remain consistent and it only differs when new miners join or leave the pool.
`;
const fee = `Pool fee is 1%.`;
const payout = `The balance will be sent to wallet address if it is larger than 10 NIMs for every 1 hour. `;

class Faq extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}
  render() {
    const { t, i18n } = this.props;

    const changeLanguage = lng => {
      i18n.changeLanguage(lng);
    };

    return (
      <Card bordered={false} style={{ width: '85%' }}>
        <Collapse defaultActiveKey={['1', '2', '3']}>
          <Panel header="What payout model is used in this pool?" key="1">
            <p>{pplns}</p>
          </Panel>
          <Panel header="What's pool fee?" key="2">
            <p>{fee}</p>
          </Panel>
          <Panel header="What's the payout time?" key="3">
            <p>{payout}</p>
          </Panel>
        </Collapse>
      </Card>
    );
  }
}
export default translate('translations')(Faq);
