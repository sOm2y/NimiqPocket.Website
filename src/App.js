import React, { Component } from 'react';

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
  Table,
  Icon
} from 'antd';
import axios from 'axios';
import './App.css';
import NetworkStats from './components/networkStats';
import PoolStats from './components/poolStats';
import HeaderStats from './components/headerStats';

const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const data = {
  linuxData: [
    {
      title: 'Linux binary beta client - Skylake',
      version: 'version 0.2.0',
      link: '/nimiqpocket-miner-linux-skylake-en.zip',
      logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
    },
    {
      title: 'Linux binary beta client - SandyBridge',
      version: 'version 0.2.0',
      link: '/nimiqpocket-miner-linux-sandybridge-en.zip',
      logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
    },
    {
      title: 'Linux binary beta client - IvyBridge',
      version: 'version 0.2.0',
      link: '/nimiqpocket-miner-linux-ivybridge-en.zip',
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
      title: 'Windows client powered by NIMIQ DESKTOP MINER ',
      version: `Mine faster with the Nimiq Desktop Miner for Windows 10. The quickest, easiest miner available for mining NIM on Windows. No compiling, no config files. Just install and start mining.`,
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

const walletAddressColumn = [
  {
    title: 'DeviceId',
    dataIndex: 'activeDeviceId',
    key: 'activeDeviceId'
  },
  {
    title: 'Hashrate',
    dataIndex: 'hashrate'
  }
];

const panes = [{ key: '1' }, { key: '2' }, { key: '3' }, { key: '4' }];

class App extends Component {
  constructor() {
    super();
    this.state = {
      isHeaderLoading: true,
      isUSloading: true,
      isKRloading: true,
      isHKloading: true,
      pool: {},
      hk: {},
      kr: {},
      poolStats: {},
      currentListVersion: [],
      isBalanceModalOpen: false,
      userBalance: {},
      loadingBalance: false,
      activeKey: panes[0].key,
      panes
    };
  }
  async componentDidMount() {
    try {
      const walletAddress = localStorage.getItem('walletAddress');
      if (walletAddress) this.fetchBalance(walletAddress);
      axios.get('https://hk.nimiqpocket.com:8444/').then(hk => {
        this.setState({
          hk: hk.data,

          isHKloading: false
        });
      });
      axios.get('https://kr.nimiqpocket.com:8444/').then(kr => {
        this.setState({
          kr: kr.data,

          isKRloading: false
        });
      });
      axios.get('https://pool.nimiqpocket.com:8444/').then(pool => {
        this.setState({
          pool: pool.data,

          isUSloading: false
        });
      });

      const [poolStats] = await Promise.all([
        axios.get('https://kr.nimiqpocket.com:5656/api/poolstats')
      ]);


      this.setState({
        poolStats: poolStats.data,
        isHeaderLoading: false,
        currentListVersion: data.linuxData
      });
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
      .get(`https://kr.nimiqpocket.com:5656/api/balance/${address}`)
      .then(res => {
        res.data.activeDevices.map(
          device => (device.hashrate = this.humanHashes(device.hashrate))
        );
        this.setState({
          isBalanceModalOpen: false,
          loadingBalance: false,

          userBalance: res.data
        });
        localStorage.setItem('walletAddress', address);
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

  render() {
    const { Header, Content, Footer } = Layout;

    return (
      <Layout className="layout">
        <HeaderStats
          isHeaderLoading={this.state.isHeaderLoading}
          hk={this.state.hk}
          poolStats={this.state.poolStats}
        />
        <Content style={{ padding: '0 50px' }}>
          <Tooltip title="Click to type your wallet address">
            <Button
              className="wallet-search"
              shape="circle"
              size="large"
              icon="search"
              onClick={this.showBalanceModal}
            />
          </Tooltip>

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
            <TabPane tab="DASHBOARD" key={this.state.panes[0].key}>
              <Row>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <PoolStats
                    loading={this.state.isHKloading}
                    title="HONG KONG"
                    flag={require('./assets/if_CN_167778.png')}
                    pool={this.state.hk}
                    poweredBy={require('./assets/azure.png')}
                  />
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <PoolStats
                    loading={this.state.isKRloading}
                    title="SOUTH KOREA"
                    flag={require('./assets/if_Korea-South_298472.png')}
                    pool={this.state.kr}
                    poweredBy={require('./assets/azure.png')}
                  />
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <PoolStats
                    loading={this.state.isUSloading}
                    title="WEST US"
                    flag={require('./assets/if_US_167805.png')}
                    pool={this.state.pool}
                    poweredBy={require('./assets/do.png')}
                  />
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <NetworkStats />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="BALANCE" key={this.state.panes[1].key}>
              {this.state.userBalance && (
                <Card
                  title={`Unpaid Balance : ${this.state.userBalance.balance / 100000} NIM`}
                  bordered={false}
                  style={{ width: '85%' }}
                >
                  <Table
                    rowKey={record => record.activeDeviceId}
                    columns={walletAddressColumn}
                    dataSource={this.state.userBalance.activeDevices}
                    loading={this.state.loadingBalance}
                  />
                  <p>
                    Total Devices:{' '}
                    {this.state.userBalance.activeDevices &&
                      this.state.userBalance.totalActiveDevices}{' '}
                    | Total Hashrate:{' '}
                    {this.state.userBalance.activeDevices &&
                      this.humanHashes(
                        this.state.userBalance.totalActiveDevicesHashrate
                      )}{' '}
                  </p>
                </Card>
              )}
            </TabPane>
            <TabPane tab="CONNECT" key={this.state.panes[2].key}>
              <Card
                title="NIMIQPOCKET BINARY MINER"
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

              <Card
                title="SETUP WITH SOURCE PACK"
                bordered={false}
                style={{ maxWidth: 1000, width: '100%', marginTop: 40 }}
              >
                <pre>{`wget https://nimiqpocket.com/nimiq-pocket-0.1.zip
unzip nimiq-pocket-miner-0.1.zip
cd nimiq-core
sudo npm install -g gulp
npm install
gulp build-node
./miner --miner=8 --wallet-address="NQXX XXXX .." --extra-data="name for your miner"

Use $ chmod 755 miner if you experience permission issue
          `}</pre>

                <a download="nimiq-pocket-0.1.zip" target="_blank" href="/">
                  {' '}
                  <Button type="primary">Download</Button>
                </a>
              </Card>
            </TabPane>
            <TabPane tab="FAQ" key={this.state.panes[3].key}>
              Coming Soon
            </TabPane>
          </Tabs>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <Row>
            Join our channels{' '}
            <a href="tencent://message/?uin=649287531" target="_blank">
              <Icon style={{ fontSize: 20 }} type="qq" />649287531
            </a>{' '}
            |{' '}
            <a href="https://discord.gg/qZZMtrK" target="_blank">
              <img
                width="26"
                height="26"
                src={require('./assets/discord-new-logo.png')}
                alt=""
              />Discord
            </a>{' '}
          </Row>
          <Row>
            Nimiq Pocket ©2018 | Stats Powered by{' '}
            <a href="https://api.nimiqx.com/" target="_blank">
              NimiqX
            </a>{' '}
            | Created by Master Do{' '}
            <a href="https://github.com/som2y" target="_blank">
              <Icon style={{ fontSize: 18 }} type="github" />
            </a>
          </Row>
        </Footer>
      </Layout>
    );
  }
}

export default App;
