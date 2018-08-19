import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import {
  Button,
  Spin,
  Card,
  Layout,
  Row,
  Col,
  List,
  Avatar,
  Tabs,
  Radio,
  Tooltip,
  Modal,
  Input,
  Drawer,
  Icon,
  Form,
  Collapse,
  Select,
  notification
} from 'antd';
import axios from 'axios';
import './App.css';
import NetworkStats from './components/networkStats';
import PoolStats from './components/poolStats';
import HeaderStats from './components/headerStats';
import Balance from './components/balance';
import Blocks from './components/blocks';
import WebMiner from './components/webMiner';
import CustomFooter from './components/customFooter';
import Faq from './components/faq';

const { Option } = Select;
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const Panel = Collapse.Panel;

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden'
};

const data = {
  linuxData: {
    intel: [
      {
        title: 'Linux binary beta client - Skylake',
        version: 'version 0.2.0',
        link: '/nimiqpocket-miner-linux-skylake-en.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      },
      {
        title: 'Linux binary beta client - Skylake Avx512',
        version: 'version 0.2.0',
        link: '/nimiqpocket-miner-linux-skylake-avx512-en.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      },
      {
        title: 'Linux binary beta client - Broadwell',
        version: 'version 0.2.0',
        link: '/nimiqpocket-miner-linux-broadwell-en.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      },
      {
        title: 'Linux binary beta client - IvyBridge',
        version: 'version 0.2.0',
        link: '/nimiqpocket-miner-linux-ivybridge-en.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      },
      {
        title: 'Linux binary beta client - SandyBridge',
        version: 'version 0.2.0',
        link: '/nimiqpocket-miner-linux-sandybridge-en.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      },

      {
        title: 'Linux中文客户端 - Skylake架构',
        version: 'version 0.2.0-zhCN',
        link: '/nimiqpocket-miner-linux-skylake-zh.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      },
      {
        title: 'Linux中文客户端 - SandyBridge架构',
        version: 'version 0.2.0-zhCN',
        link: '/nimiqpocket-miner-linux-sandybridge-zh.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      },
      {
        title: 'Linux中文客户端 - IvyBridge架构',
        version: 'version 0.2.0-zhCN',
        link: '/nimiqpocket-miner-linux-ivybridge-zh.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      }
    ],
    ryzen: [
      {
        title: 'Linux binary beta client - Ryzen',
        version: 'version 0.2.0',
        link: '/nimiqpocket-miner-linux-ryzen-en.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      }
    ]
  },
  macData: [
    {
      title: 'Mac binary beta client',
      version: 'Coming Soon',
      // link: '/nimiqpocket-mac-v0.0.1.zip',
      logo: require('./assets/if_apple-ios-system-platform-os-mac-linux_652586.png')
    }
  ],
  wslData: [
    {
      title: 'NIMIQ DESKTOP MINER ',
      version: `version 0.3.0`,
      link: 'https://nimiqdesktop.com/',
      logo: require('./assets/if_windows_1296843.png')
    }
  ],
  androidData: [
    {
      title: 'Android client (Coming Soon)',
      version: ` What's this? Nimiqpocket mobile client app allows you mining
      nimiq on your mobile devices with a simple click. Instead of mining on
      your mobile web browser, Nimiqpocket mobile client creates
      real NodeJS thread and makes a bridge between native layout so
      that you can get much higher hashrate on your mobile devices.`,
      // link: '/nimiqpocket-windows-v0.0.1.zip,
      logo: require('./assets/if_android_1269841.png')
    }
  ]
};

const panes = [
  { key: '1' },
  { key: '2' },
  { key: '3' },
  { key: '4' },
  { key: '5' }
];

class App extends Component {
  constructor() {
    super();
    this.state = {
      isUSloading: true,
      isKRloading: true,
      isHKloading: true,
      pool: {},
      hk: {},
      eu: {},
      us:{},
      poolStats: {},
      currentListVersion: [],
      isBalanceModalOpen: false,
      userBalance: {},
      devices:{},
      loadingBalance: false,
      activeKey: panes[0].key,
      panes,
      visible: false,
      walletAddress: '',
      poolAddress: 'us.nimiqpocket.com'
    };
  }
  async componentDidMount() {
    try {
      const walletAddress = localStorage.getItem('walletAddress');
      if (walletAddress) {
        this.fetchBalance(walletAddress);
        this.setState({ walletAddress: walletAddress });
      }

      axios.get('https://us.nimiqpocket.com:8444/').then(pool => {
        this.setState({
          pool: pool.data,

          isUSloading: false
        });
      });
      // axios.get('https://us.nimiqpocket.com:8444/').then(us => {
      //   this.setState({
      //     us: us.data,

      //     isUSloading: false
      //   });
      // });

      this.setState({
        currentListVersion: data.linuxData
      });

      const args = {
        message: 'Update on 31st July 2018',
        description:
          'Launched web miner and supported Ryzen and Intel broadwell/skylake-avx512',
        duration: 10,
        icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />
      };
      notification.open(args);

      setInterval(() => {
        this.setState({
          isUSloading: true,
          isKRloading: true,
          isHKloading: true
        });
        axios.get('https://us.nimiqpocket.com:8444/').then(pool => {
          this.setState({
            pool: pool.data,

            isUSloading: false
          });
        });
        // axios.get('https://us.nimiqpocket.com:8444/').then(us => {
        //   this.setState({
        //     us: us.data,

        //     isUSloading: false
        //   });
        // });
      }, 1000 * 60 * 3);
    } catch (e) {
      console.log(e);
    }
  }

  showCurrentVersionData = (e, data) => {
    if (e.target.value === 'linux') {
      this.setState({ currentListVersion: data.linuxData });
    } else if (e.target.value === 'mac') {
      this.setState({ currentListVersion: data.macData });
    } else if (e.target.value === 'wsl') {
      this.setState({ currentListVersion: data.wslData });
    } else if (e.target.value === 'android') {
      this.setState({ currentListVersion: data.androidData });
    }
  };

  showBalanceModal = () => {
    this.setState({
      isBalanceModalOpen: true
    });
  };

  fetchBalance = address => {
    this.setState({
      loadingBalance: true
    });
    axios
      .get(`https://api.nimiqpocket.com:8080/api/device/${address}`)
      .then(res => {
        res.data.activeDevices.map(
          device => (device.hashrate = this.humanHashes(device.hashrate))
        );
        this.setState({
          isBalanceModalOpen: false,
          loadingBalance: false,

          devices: res.data
        });
        localStorage.setItem('walletAddress', address);
      })
      .catch(err => {
        console.log(err);
      });
      axios
      .get(`https://api.nimiqpocket.com:8080/api/balance/${address}`)
      .then(res => {
      
        this.setState({
          userBalance: res.data
        });

      })
      .catch(err => {
        console.log(err);
      });
  };

  closeBalanceModal = e => {
    console.log(e);
    this.setState({
      isBalanceModalOpen: false
    });
  };

  humanHashes = bytes => {
    let thresh = 1000;
    if (Math.abs(bytes) < thresh) {
      return bytes + ' H/s';
    }
    let units = [
      'kH/s',
      'MH/s',
      'GH/s',
      'TH/s',
      'PH/s',
      'EH/s',
      'ZH/s',
      'YH/s'
    ];
    let u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
  };

  onTabChange = activeKey => {
    this.setState({ activeKey });
  };

  getUserTotalHashrate(devices) {
    let totalHashrate = 0;
    devices.map(device => {
      totalHashrate = +device.hashrate;
    });
    return this.humanHashes(totalHashrate);
  }

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  onChangeWalletAddress = e => {
    const { value } = e.target;
    this.setState({ walletAddress: value });
    console.log(this.state.walletAddress);
  };
  onChangePoolAddress = poolAddress => {
    this.setState({ poolAddress });
    console.log(poolAddress, this.state.poolAddress);
  };
  render() {
    const { Header, Content, Footer } = Layout;
    const { t, i18n } = this.props;

    const changeLanguage = lng => {
      i18n.changeLanguage(lng);
    };
    return (
      <Layout className="layout">
        <HeaderStats hk={this.state.hk} />
        <Content style={{ padding: '0 50px' }}>
          <Row
            style={{
              width: '90%',
              position: 'relative',
              height: '100%'
            }}
          >
            <Tooltip title="Click to type your wallet address">
              <Button
                className="wallet-search"
                shape="circle"
                size="large"
                icon="search"
                onClick={this.showBalanceModal}
              />
            </Tooltip>
            <Tooltip title="Web Miner">
              <Button
                className="web-miner"
                shape="circle"
                size="large"
                icon="cloud-o"
                onClick={this.showDrawer}
              />
            </Tooltip>
          </Row>
          <Drawer
            title="NimiqPocket Web Miner"
            placement="left"
            width={430}
            closable={true}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <Row>
              <Col span={24}>
                <Input
                  onChange={this.onChangeWalletAddress}
                  value={this.state.walletAddress}
                  placeholder="Please enter your wallet address"
                />
              </Col>

              <Col span={24}>
                <Select
                  value={this.state.poolAddress}
                  onChange={this.onChangePoolAddress}
                  placeholder="Please select a pool close to you"
                >
    
                  <Option value="us.nimiqpocket.com">
                    us.nimiqpocket.com(US)
                  </Option>
                </Select>
              </Col>
            </Row>

            <WebMiner
              network="main"
              address={this.state.walletAddress}
              poolServer={this.state.poolAddress}
              poolPort={8444}
              // targetHash="500000"
              width="260px"
              height="auto"
              autoStart={false}
              displayMode="full"
              border={false}
            />
          </Drawer>

          <Modal
            title="Wallet Address"
            visible={this.state.isBalanceModalOpen}
            // onOk={this.fetchBalance}
            onCancel={this.closeBalanceModal}
            footer={null}
          >
            <Search
              placeholder="Type your wallet address here"
              enterButton="Search"
              size="large"
              onSearch={address => {
                this.fetchBalance(address);
                this.setState({ activeKey: '2' });
              }}
            />
          </Modal>
          <Tabs activeKey={this.state.activeKey} onChange={this.onTabChange}>
            <TabPane tab={t('dashboard.title')} key={this.state.panes[0].key}>
              <Row>
          

                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <PoolStats
                    loading={this.state.isUSloading}
                    title={t('dashboard.us_w')}
                    flag={require('./assets/if_US_167805.png')}
                    pool={this.state.pool}
                    poweredBy={require('./assets/azure.png')}
                  />
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <NetworkStats />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={t('balance.title')} key={this.state.panes[1].key}>
              {this.state.userBalance && (
                <Balance
                  userBalance={this.state.userBalance}
                  devices={this.state.devices}
                  loadingBalance={this.state.loadingBalance}
                />
              )}
            </TabPane>
            <TabPane tab={t('blocks.title')} key={this.state.panes[2].key}>
              <Blocks />
            </TabPane>
            <TabPane tab={t('connect.title')} key={this.state.panes[3].key}>
              <Card
                title="CONNECT WITH NIMIQPOCKET MINER"
                bordered={false}
                style={{ maxWidth: 1000, width: '100%', marginTop: 40 }}
              >
                <RadioGroup
                  onChange={e => {
                    this.showCurrentVersionData(e, data);
                  }}
                  defaultValue="linux"
                >
                  <RadioButton value="linux">Linux</RadioButton>
                  <RadioButton value="mac">Mac OSX</RadioButton>
                  <RadioButton value="wsl">Windows</RadioButton>
                  <RadioButton value="android">Android</RadioButton>
                </RadioGroup>

                {this.state.currentListVersion.intel && (
                  <Collapse bordered={false}>
                    <Panel
                      header={
                        <img src={require('./assets/Intel-event-logo.png')} />
                      }
                      key="1"
                      style={customPanelStyle}
                    >
                      <List
                        size="large"
                        dataSource={this.state.currentListVersion.intel}
                        renderItem={item => (
                          <List.Item
                            actions={[
                              item.link && (
                                <a href={item.link} target="_blank" download>
                                  {' '}
                                  <Button type="primary">Download</Button>
                                </a>
                              )
                            ]}
                          >
                            <List.Item.Meta
                              avatar={<Avatar src={item.logo} />}
                              title={item.title}
                              description={item.version}
                            />
                          </List.Item>
                        )}
                      />
                    </Panel>
                    <Panel
                      className="ryzen"
                      header={
                        <img src={require('./assets/ryzen-logo-300x150.png')} />
                      }
                      key="2"
                      style={customPanelStyle}
                    >
                      <List
                        size="large"
                        dataSource={this.state.currentListVersion.ryzen}
                        renderItem={item => (
                          <List.Item
                            actions={[
                              item.link && (
                                <a href={item.link} target="_blank" download>
                                  {' '}
                                  <Button type="primary">Download</Button>
                                </a>
                              )
                            ]}
                          >
                            <List.Item.Meta
                              avatar={<Avatar src={item.logo} />}
                              title={item.title}
                              description={item.version}
                            />
                          </List.Item>
                        )}
                      />
                    </Panel>
                  </Collapse>
                )}
                {!this.state.currentListVersion.intel && (
                  <List
                    size="large"
                    dataSource={this.state.currentListVersion}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          item.link && (
                            <a href={item.link} target="_blank" download>
                              {' '}
                              <Button type="primary">Download</Button>
                            </a>
                          )
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={item.logo} />}
                          title={item.title}
                          description={item.version}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>

              <Card
                title="CONNECT WITH OFFICAL NODEJS MINER"
                bordered={false}
                style={{ maxWidth: 1000, width: '100%', marginTop: 40 }}
              >
                <pre
                >{`To connect, add '--pool=pool.nimiqpocket.com:8444' to your NodeJS miner command line, 
or add the below to your config file:

poolMining: {
   enabled: true,
   host: 'pool.nimiqpocket.com',
   port: 8444,
}
          `}</pre>
              </Card>

           
            </TabPane>
            <TabPane tab={t('faq.title')} key={this.state.panes[4].key}>
              <Faq />
            </TabPane>
          </Tabs>
        </Content>
        <CustomFooter />
      </Layout>
    );
  }
}

export default translate('translations')(App);
