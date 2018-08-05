import React, { Component } from 'react';
import { Card, Spin, Row, Layout, Col, Icon } from 'antd';
import axios from 'axios';
import { translate, Trans } from 'react-i18next';
import { humanHashes } from '../Helper/statsFormat';
const { Header, Content, Footer } = Layout;

class CustomFooter extends Component {
  constructor(props) {
    super(props);
    this.state = { price: {} };
  }
  async componentDidMount() {
    const [price] = await Promise.all([
      axios.get('https://us.nimiqpocket.com:5656/api/price')
    ]);

    this.setState({
      price: price.data
    });
  }
  render() {
    const { t, i18n } = this.props;

    const changeLanguage = lng => {
      i18n.changeLanguage(lng);
    };

    return (
      <Footer style={{ textAlign: 'center' }}>
        <Card>
          <Row style={{ maxWidth: '100%' }}>
            <Col
              xs={24}
              sm={14}
              md={14}
              lg={14}
              xl={14}
              style={{ textAlign: 'left' }}
            >
              <a href="https://nimiq.community/" target="_blank">
                COMMUNITY
              </a>
              <a href="https://www.nimiqchina.com/" target="_blank">
                NIMIQCHINA|中文
              </a>
              <a href="https://zhuanlan.zhihu.com/nimiq" target="_blank">
                {' '}
                NIMIQ <Icon type="zhihu" />
              </a>
              <span>
                {' '}
                <strong>
                  {t('dashboard.network.price.btc')} {this.state.price.btc}/{' '}
                  {t('dashboard.network.price.usd')} {this.state.price.usd}{' '}
                  {this.state.price.percent_change_24h &&
                  this.state.price.percent_change_24h.usd >0 ? (
                    <Icon style={{ color: 'green' }} type="caret-up" />
                  ) : (
                    <Icon style={{ color: 'red' }} type="caret-down" />
                  )}
                  {this.state.price.percent_change_24h &&
                    this.state.price.percent_change_24h.usd}%{' '}
                </strong>
              </span>
            </Col>
            <Col
              xs={24}
              sm={10}
              md={10}
              lg={10}
              xl={10}
              style={{ textAlign: 'right' }}
            >
              NimiqPocket ©2018 |
              <a href="https://discord.gg/qZZMtrK" target="_blank">
                <img
                  width="100"
                  height="34"
                  src={require('../assets/Discord-Logo+Wordmark-Color.png')}
                  alt="Discord"
                />
              </a>
              <a
                target="_blank"
                href="//shang.qq.com/wpa/qunwpa?idkey=9fbcea0108f94f02aa4633e9fdd651a4f36807eb804db57029c26a5e87cafc79"
              >
                <img
                  style={{
                    top: -3,
                    position: 'relative'
                  }}
                  border="0"
                  src="//pub.idqqimg.com/wpa/images/group.png"
                  alt="Nimiq口袋"
                  title="Nimiq口袋 649287531"
                />
              </a>
            </Col>
          </Row>
        </Card>
      </Footer>
    );
  }
}
export default translate('translations')(CustomFooter);
