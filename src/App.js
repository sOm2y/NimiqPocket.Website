import React, { Component } from 'react';
import logo from './logo.svg';
import {
  Button,
  Spin,
  Card,
  Layout,
  Menu,
  Breadcrumb,
  List,
  Avatar
} from 'antd';
import axios from 'axios';
import './App.css';
import Datamap from 'datamaps';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      pool: {}
    };
  }
  componentDidMount() {
    axios
      .get('https://pool.nimiqpocket.com:8444/')
      .then(response => {
        this.setState({ pool: response.data, isLoading: false });
      })
      .catch(error => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }
  render() {
    const { Header, Content, Footer } = Layout;
    const data = [
      {
        title: 'Linux binary beta client',
        version: 'version 0.0.1',
        link: '/nimiqpocket-linux-v0.0.1.zip'
      },
      {
        title: 'Mac binary beta client',
        version: 'version 0.0.1',
        link: '/nimiqpocket-mac-v0.0.1.zip'
      },
      {
        title: 'Windows binary beta client',
        version: 'version 0.0.1',
        link: '/nimiqpocket-windows-v0.0.1.zip'
      }
    ];

    if (this.state.isLoading) {
      return (
        <Layout className="layout">
          <Spin />
        </Layout>
      );
    }

    return (
      <Layout className="layout">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Nimiq Pocket Pool</h1>
        </header>
        <Content style={{ padding: '0 50px' }}>
          <Card
            title="POOL INFORMATION"
            bordered={false}
            style={{ maxWidth: 500, width: '100%' }}
          >
            <h4>Pool Name: {this.state.pool.poolName}</h4>
            <h4>Pool Number: {this.state.pool.poolPort}</h4>
            <h4>Pool Address: {this.state.pool.poolAddress}</h4>
            <h4>
              Pool HashRate:{' '}
              {this.state.pool.hashRate.toLocaleString(navigator.language, {
                minimumFractionDigits: 0
              })}{' '}
              h/s
            </h4>
            <h4>Number Miners : {this.state.pool.numClients}</h4>
            <h4>Pool Fee: {this.state.pool.poolFee} %</h4>
            <h4>Mined Blocks: {this.state.pool.minedBlocks}</h4>

            <p>
              Auto Payout: Every 1 hour for confirmed balance over 10 NIM
            </p>
          </Card>
          <Card
            title="HOW TO CONNECT"
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
            title="MOBILE PACK"
            bordered={false}
            style={{ maxWidth: 1000, width: '100%', marginTop: 40 }}
          >
            <p>COMING SOON ...</p>
            <p>
              What's this? Nimiqpocket mobile client app can let you mine nimiq
              on your mobile with a simple click. Instead of mining on your
              mobile web browser, Nimiqpocket mobile client creates real NodeJS
              thread and makes a bridge between native layout so that you can
              get much more performance on your mobile phone.{' '}
            </p>
          </Card>
          <Card
            title="BINARY PACK"
            bordered={false}
            style={{ maxWidth: 1000, width: '100%', marginTop: 40 }}
          >
            <pre
            >{`UV_THREADPOOL_SIZE=XXX ./miner --wallet-address="NQXX XXXX ...."`}</pre>
            <List
              size="large"
              dataSource={data}
              renderItem={item => (
                <List.Item actions={[<a href={item.link} download> <Button type="primary">Download</Button></a>]}>
                  <List.Item.Meta
                    avatar={
                      <Avatar src="https://api.nimiq.watch/iqon/NQ17+RX48+P6EB+H1X4+SYDD+353X+BQHR+BYLL+TY99" />
                    }
                    title={item.title}
                    description={item.version}
                  />
                  {/* <div>content</div> */}
                </List.Item>
              )}
            />
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
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Nimiq Pocket ©2018 | Create by Master Do
        </Footer>
      </Layout>
    );
  }
}

export default App;
