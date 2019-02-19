import React, { Component } from 'react'
import { withTranslation, Trans } from 'react-i18next'
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
} from 'antd'
import {
  ChartCard,
  Field,
  MiniArea,
  MiniBar,
  MiniProgress
} from 'ant-design-pro/lib/Charts'
import Trend from 'ant-design-pro/lib/Trend'
import NumberInfo from 'ant-design-pro/lib/NumberInfo'
import numeral from 'numeral'
import moment from 'moment'

import axios from 'axios'
import './App.css'
import NetworkStats from './components/networkStats'
import PoolStats from './components/poolStats'
import HeaderStats from './components/headerStats'
import Balance from './components/balance'
import Blocks from './components/blocks'
import WebMiner from './components/webMiner'
import CustomFooter from './components/customFooter'
import Faq from './components/faq'
import MarketStats from './components/marketStats'
import GenerateScript from './components/forms/generateScript'

const { Option } = Select
const TabPane = Tabs.TabPane
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Search = Input.Search
const Panel = Collapse.Panel

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden'
}

const visitData = []
const beginDay = new Date().getTime()
for (let i = 0; i < 20; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format(
      'YYYY-MM-DD'
    ),
    y: Math.floor(Math.random() * 100) + 10
  })
}
const GPUData ={
  intel: [
    {
      title: 'Nimiqpocket GPU miner (AMD & NVIDIA) - Windows',
      version: 'version 1.1.0',
      link: '/nimiqpocket-gpu-win-1.1.0.zip',
      logo: require('./assets/if_windows_1296843.png')
    },{
      title: 'Nimiqpocket GPU miner - Linux',
      version: 'COMINING SOON',
      link: '',
      logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
    }]
}

const data = {
  linuxData: {
    intel: [
      {
        title: 'Linux binary client - Skylake',
        version: 'version 0.4.3',
        link: '/nimiqpocket-miner-linux-skylake-en.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      },
      {
        title: 'Linux binary client - Skylake Avx512',
        version: 'version 0.4.3',
        link: '/nimiqpocket-miner-linux-skylake-avx512-en.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      },
      {
        title: 'Linux binary client - Broadwell',
        version: 'version 0.4.3',
        link: '/nimiqpocket-miner-linux-broadwell-en.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      },
      {
        title: 'Linux binary client - IvyBridge',
        version: 'version 0.4.3',
        link: '/nimiqpocket-miner-linux-ivybridge-en.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      }
    ],
    ryzen: [
      {
        title: 'Linux binary client - Ryzen',
        version: 'version 0.4.3',
        link: '/nimiqpocket-miner-linux-ryzen-en.zip',
        logo: require('./assets/if_linux-server-system-platform-os-computer-penguin_652577.png')
      }
    ]
  },
  macData: [
    {
      title: 'Mac binary client',
      version: 'Coming Soon',
      // link: '/nimiqpocket-mac-v0.0.1.zip',
      logo: require('./assets/if_apple-ios-system-platform-os-mac-linux_652586.png')
    }
  ],
  wslData: [
    {
      title: 'NIMIQ DESKTOP MINER ',
      version: `version 0.3.1`,
      link: 'https://nimiqdesktop.com/',
      logo: require('./assets/if_windows_1296843.png')
    },
    {
      title: 'Windows binary client - AVX',
      version: `version 0.4.3`,
      link: '/nimiqpocket-miner-win-avx-en.zip',
      logo: require('./assets/if_windows_1296843.png')
    },
    {
      title: 'Windows binary client - AVX2',
      version: `version 0.4.3`,
      link: '/nimiqpocket-miner-win-avx2-en.zip',
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
}

const panes = [
  { key: '1' },
  { key: '2' },
  { key: '3' },
  { key: '4' },
  { key: '5' }
]

class App extends Component {
  constructor() {
    super()
    this.state = {
      isUSloading: true,
      isKRloading: true,
      isHKloading: true,
      usCache: {},
      hkCache: {},
      pool: {},
      hk: {},
      eu: {},
      us: {},
      poolStats: {},
      currentListVersion: [],
      gpuCurrentListVersion: [],
      isBalanceModalOpen: false,
      userBalance: {},
      payouts: [],
      devices: {},
      inactiveDevices: [],
      loadingBalance: false,
      activeKey: panes[0].key,
      panes,
      visible: false,
      walletAddress: '',
      poolAddress: 'us.nimiqpocket.com'
    }
  }
  async componentDidMount() {
    try {
      const walletAddress = localStorage.getItem('walletAddress')
      if (walletAddress) {
        this.fetchBalance(walletAddress)
        this.setState({ walletAddress: walletAddress })
      }

      axios.get('https://api.nimiqpocket.com:8080/api/cache/us').then(pool => {
        this.setState({
          usCache: pool.data

          // isUSloading: false
        })
      })

      axios.get('https://api.nimiqpocket.com:8080/api/cache/hk').then(pool => {
        this.setState({
          hkCache: pool.data

          // isUSloading: false
        })
      })

      // axios.get('https://api.nimiqpocket.com:8080/api/poolstats').then(pool => {
      //   this.setState({
      //     pool: pool.data,

      //     isUSloading: false
      //   });
      // });
      axios
        .get('https://api.nimiqpocket.com:8080/api/poolstats/us')
        .then(us => {
          this.setState({
            us: us.data,

            isUSloading: false
          })
        })

      axios
        .get('https://api.nimiqpocket.com:8080/api/poolstats/hk')
        .then(hk => {
          this.setState({
            hk: hk.data,

            isHKloading: false
          })
        })

      this.setState({
        currentListVersion: data.linuxData,
        gpuCurrentListVersion: GPUData
      })

      const args = {
        message: 'GPU MINER HAS RELEASED',
        description: `A community member has release GPU miner suits for Nvidia Graph cards, it charges 2% as dev fee. https://github.com/NoncerPro/noncerpro-nimiq-cuda/releases`,
        duration: 10,
        icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />
      }
      notification.open(args)

      setInterval(() => {
        this.setState({
          isUSloading: true,
          isKRloading: true,
          isHKloading: true
        })
        axios
          .get('https://api.nimiqpocket.com:8080/api/poolstats/us')
          .then(us => {
            this.setState({
              us: us.data,

              isUSloading: false
            })
          })

        axios
          .get('https://api.nimiqpocket.com:8080/api/poolstats/hk')
          .then(hk => {
            this.setState({
              hk: hk.data,

              isHKloading: false
            })
          })
      }, 1000 * 60 * 1)
    } catch (e) {
      console.log(e)
    }
  }

  showCurrentVersionData = (e, data) => {
    if (e.target.value === 'linux') {
      this.setState({ currentListVersion: data.linuxData })
    } else if (e.target.value === 'mac') {
      this.setState({ currentListVersion: data.macData })
    } else if (e.target.value === 'wsl') {
      this.setState({ currentListVersion: data.wslData })
    } else if (e.target.value === 'android') {
      this.setState({ currentListVersion: data.androidData })
    }
  }

  showGPUCurrentVersionData = (e, data) => {
    if (e.target.value === 'linux') {
      this.setState({ gpuCurrentListVersion: data.linuxData })
  
    } else if (e.target.value === 'wsl') {
      this.setState({ gpuCurrentListVersion: data.wslData })
    }
  }

  showBalanceModal = () => {
    this.setState({
      isBalanceModalOpen: true
    })
  }

  fetchBalance = address => {
    this.setState({
      loadingBalance: true
    })
    axios
      .get(`https://api.nimiqpocket.com:8080/api/device/active/${address}`)
      .then(res => {
        res.data.activeDevices.map(
          device => (device.hashrate = this.humanHashes(device.hashrate))
        )
        this.setState({
          isBalanceModalOpen: false,
          loadingBalance: false,

          devices: res.data
        })
        localStorage.setItem('walletAddress', address)
      })
      .catch(err => {
        console.log(err)
      })
    axios
      .get(`https://api.nimiqpocket.com:8080/api/device/inactive/${address}`)
      .then(res => {
        res.data.inactiveDevices.map(
          device => (device.hashrate = this.humanHashes(device.hashrate))
        )
        this.setState({
          isBalanceModalOpen: false,
          loadingBalance: false,
          inactiveDevices: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
    axios
      .get(`https://api.nimiqpocket.com:8080/api/balance/${address}`)
      .then(res => {
        this.setState({
          userBalance: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })

    axios
      .get(`https://api.nimiqpocket.com:8080/api/payout/${address}`)
      .then(res => {
        this.setState({
          payouts: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  closeBalanceModal = e => {
    console.log(e)
    this.setState({
      isBalanceModalOpen: false
    })
  }

  humanHashes = bytes => {
    let thresh = 1000
    if (Math.abs(bytes) < thresh) {
      return bytes + ' H/s'
    }
    let units = ['kH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s', 'ZH/s', 'YH/s']
    let u = -1
    do {
      bytes /= thresh
      ++u
    } while (Math.abs(bytes) >= thresh && u < units.length - 1)
    return bytes.toFixed(1) + ' ' + units[u]
  }

  onTabChange = activeKey => {
    this.setState({ activeKey })
  }

  getUserTotalHashrate(devices) {
    let totalHashrate = 0
    devices.map(device => {
      totalHashrate = +device.hashrate
    })
    return this.humanHashes(totalHashrate)
  }

  showDrawer = () => {
    this.setState({
      visible: true
    })
  }

  onClose = () => {
    this.setState({
      visible: false
    })
  }

  onChangeWalletAddress = e => {
    const { value } = e.target
    this.setState({ walletAddress: value })
    console.log(this.state.walletAddress)
  }
  onChangePoolAddress = poolAddress => {
    this.setState({ poolAddress })
    console.log(poolAddress, this.state.poolAddress)
  }
  render() {
    const { Header, Content, Footer } = Layout
    const { t, i18n } = this.props

    const changeLanguage = lng => {
      i18n.changeLanguage(lng)
    }
    return (
      <Layout className="layout">
        <HeaderStats hk={this.state.hk} />
        <Content style={{ padding: '0 50px' }}>
          <Row
            style={{
              // width: '90%',
              position: 'relative'
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
                this.fetchBalance(address)
                this.setState({ activeKey: '2' })
              }}
            />
          </Modal>

          <Tabs activeKey={this.state.activeKey} onChange={this.onTabChange}>
            <TabPane tab={t('dashboard.title')} key={this.state.panes[0].key}>
              <Row>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  
                  <PoolStats
                    loading={this.state.isUSloading}
                    title="us.nimiqpocket.com:8444"
                    flag={require('./assets/if_US_167805.png')}
                    pool={this.state.us}
                    poweredBy={require('./assets/Alibaba-Cloud---resized-v2.png')}
                  >
                    <MiniArea
                      line
                      height={40}
                      data={this.state.usCache.hashrate}
                    />
                          {/* <MiniBar  height={40}  data={this.state.cachePool.client} /> */}
                  </PoolStats>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <PoolStats
                    loading={this.state.isHKloading}
                    title="hk.nimiqpocket.com:8444"
                    flag={require('./assets/if_CN_167778.png')}
                    pool={this.state.hk}
                    poweredBy={require('./assets/Alibaba-Cloud---resized-v2.png')}
                  >
                   <MiniArea
                      line
                      height={40}
                      data={this.state.hkCache.hashrate}
                    />
                       {/* <MiniBar  height={40}  data={this.state.cachePool.client} /> */}
                  </PoolStats>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <NetworkStats />
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <MarketStats />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={t('balance.title')} key={this.state.panes[1].key}>
              {this.state.userBalance && (
                <Balance
                  userBalance={this.state.userBalance}
                  devices={this.state.devices}
                  inactiveDevices={this.state.inactiveDevices}
                  payouts={this.state.payouts}
                  loadingBalance={this.state.loadingBalance}
                />
              )}
            </TabPane>
            <TabPane tab={t('blocks.title')} key={this.state.panes[2].key}>
              <Blocks />
            </TabPane>
            <TabPane tab={t('connect.title')} key={this.state.panes[3].key}>
            <Card
                title="CONNECT WITH NIMIQPOCKET GPU MINER"
                bordered={false}
                style={{ maxWidth: 1000, width: '100%', marginTop: 40 }}
              >
         
                <List
                  size="large"
                  dataSource={this.state.gpuCurrentListVersion.intel}
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
                title="CONNECT WITH NIMIQPOCKET CPU MINER"
                bordered={false}
                style={{ maxWidth: 1000, width: '100%', marginTop: 40 }}
              >
                <RadioGroup
                  onChange={e => {
                    this.showCurrentVersionData(e, data)
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
                <pre>{`To connect, add '--pool=us.nimiqpocket.com:8444' to your NodeJS miner command line, 
or add the below to your config file:

poolMining: {
   enabled: true,
   host: 'us.nimiqpocket.com',
   port: 8444,
}
          `}</pre>
              </Card>
            </TabPane>
            <TabPane tab={t('faq.title')} key={this.state.panes[4].key}>
              <Faq />
            </TabPane>
          </Tabs>
          {/* <Row
            style={{
     
            }}
          >
            <Collapse>
              <Panel
                header={"Linux Script —— One command for deploying on cloud"}
                key="1"
                style={customPanelStyle}
              ><GenerateScript /></Panel>
            </Collapse>

          </Row> */}
        </Content>
        <CustomFooter />
      </Layout>
    )
  }
}

export default withTranslation('translations')(App)
