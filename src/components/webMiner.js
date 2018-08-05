import React from 'react';
import { Card, Spin, Icon, Progress, Button } from 'antd';

import Script from 'react-load-script';

const mainnetCdn = 'https://cdn.nimiq.com/nimiq.js'; // mainnet
const testnetCdn = 'https://cdn.nimiq-testnet.com/nimiq.js'; // testnet

class WebMiner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hashRate: 0,
      threadCount: Math.ceil(navigator.hardwareConcurrency),
      doMining: false,
      showProgress: false,
      statusMsg: 'Ready.',
      miner: undefined,
      buttonDisabled: true,
      totalHashCount: 0,
      totalElapsed: 0,
      progressPercent: 0,
      address: '',
      targetHash: Infinity,
      width: 0,
      height: 0,
      autoStart: false,
      scriptLoaded: false,
      scriptError: false,
      displayMode: 'full',
      border: false,
      network: 'main',
      poolServer: '',
      poolPort: 8444
    };


    // this.increaseThread = this.increaseThread.bind(this);
    // this.decreaseThread = this.decreaseThread.bind(this);
    // this.updateMsg = this.updateMsg.bind(this);
    // this.handleMiningButtonChange = this.handleMiningButtonChange.bind(this);
    // this.initialise = this.initialise.bind(this);
    // this.loadNimiqEngine = this.loadNimiqEngine.bind(this);
    // this.handleScriptCreate = this.handleScriptCreate.bind(this);
    // this.handleScriptError = this.handleScriptError.bind(this);
    // this.handleScriptLoad = this.handleScriptLoad.bind(this);
  }

  componentDidMount(){
    // this.initialise();
  }

  loadNimiqEngine = () => {
    if (window.Nimiq === undefined) {
      return false;
    } else {
      window.Nimiq.init(this.initialise, function(code) {
        switch (code) {
          case window.Nimiq.ERR_WAIT:
            this.updateMsg('Another Nimiq instance already running.');
            break;
          case window.Nimiq.ERR_UNSUPPORTED:
            this.updateMsg('Browser not supported.');
            break;
          case window.Nimiq.Wallet.ERR_INVALID_WALLET_SEED:
            this.updateMsg('Invalid wallet seed.');
            break;
          default:
            this.updateMsg('Nimiq initialisation error.');
            break;
        }
      });
      return true;
    }
  }

  handleMiningButtonChange= (doMining) => {
    const address = this.props.address;

    if (this.state.miner === undefined) {
      // need to create a miner
      console.log('Loading Nimiq engine.');
      this.updateMsg('Connecting.');
      if (this.loadNimiqEngine()) {
        this.setState({
          doMining: true,
          showProgress: true
        });
      } else {
        this.updateMsg('Cannot load Nimiq engine.');
      }
    } else {
      // otherwise flip the state
      doMining = !doMining;
      let newMsg = '';
      if (doMining) {
        newMsg = 'Mining to ' + address + '.';
        this.state.miner.startWork();
      } else {
        newMsg = 'Stopped.';
        this.state.miner.stopWork();
      }

      this.updateMsg(newMsg);
      this.setState({
        doMining: doMining
      });
    }
  }

  increaseThread = (e) =>{
    let newThreadCount = this.state.threadCount;
    let miner = this.state.miner;
    if (newThreadCount < navigator.hardwareConcurrency) {
      newThreadCount += 1;
    }
    this.setState({
      threadCount: newThreadCount
    });
    miner.threads = newThreadCount;
  }

  decreaseThread = (e) => {
    let newThreadCount = this.state.threadCount;
    let miner = this.state.miner;
    if (newThreadCount > 1) {
      newThreadCount -= 1;
    }
    this.setState({
      threadCount: newThreadCount
    });
    miner.threads = newThreadCount;
  }

  handleScriptCreate = () => {
    this.setState({ scriptLoaded: false });
  }

  handleScriptError() {
    this.setState({ scriptError: true });
    this.updateMsg('Cannot load Nimiq engine.');
  }

  handleScriptLoad = () =>  {
    this.setState({ scriptLoaded: true });
    if (this.props.autoStart) {
      this.setState({
        doMining: true
      });
      this.handleMiningButtonChange(this.state.doMining);
    }
  }

  render() {

    // to hide or show the mining toggle button
    let displayToggle = null;
    if (this.state.buttonDisabled) {
      displayToggle = {
        visibility: 'hidden'
      };
    } else {
      displayToggle = {
        visibility: 'visible'
      };
    }

    // for the buttons to increase or decrease threads
    // TODO: make this its own component
    let incDecThread = null;
    if (this.state.displayMode === 'full') {
      incDecThread = (
        <div style={displayToggle}>
          <Button
          type="primary" shape="circle" icon="minus" size='large'
            onClick={this.decreaseThread}
     
            disabled={this.state.buttonDisabled}
          />
            

          <Button
           type="primary" shape="circle" icon="plus" size='large'
            onClick={this.increaseThread}
    
            disabled={this.state.buttonDisabled}
          />
            

        </div>
      );
    }

    const cdnUrl =
      this.state.network === 'main' ? 'https://cdn.nimiq.com/nimiq.js' : testnetCdn;
    const scriptLoader = (
      <Script
        url={cdnUrl}
        onCreate={this.handleScriptCreate}
        onError={this.handleScriptError}
        onLoad={this.handleScriptLoad}
      />
    );

    let myProgress = null;
    if (this.state.targetHash > 0 && this.state.targetHash < Infinity) {
      myProgress = (
        <Progress
          type="circle"
          percent={this.state.progressPercent}
          width={80}
        />
      );
    }

    // nothing to display, just start the miner
    if (this.state.displayMode === 'none') {
      return <div>{scriptLoader}</div>;
    }

    // otherwise for displayMode 'compact' or 'full'
    return (
      <div style={{ textAlign: 'center' }}>
        <Card>
          {scriptLoader}

          <HashRate display={this.state.hashRate} />
          <StatusMessage
            display={this.state.statusMsg}
            showProgress={this.state.showProgress}
          />
          {myProgress}
          <ThreadCount
            display={this.state.threadCount}
            total={this.state.totalHashCount}
            time={this.state.totalElapsed}
          />
          {incDecThread}
        </Card>
        <Button
          shape="circle"
          className={'start'}
          onClick={() => this.handleMiningButtonChange(this.state.doMining)}
        >
          {this.state.doMining ? 'Stop' : 'Start'}
        </Button>
      </div>
    );
  }

  updateMsg = (newMsg)=> {
    this.setState({
      statusMsg: newMsg
    });
  }

   initialise = async () => {
    // $ is the Nimiq.Core instance
    const $ = {};
    let currentComponent = this;

     const _onConsensusEstablished =() =>{
      const address = $.wallet.address.toUserFriendlyAddress();
      currentComponent.updateMsg('Mining to ' + address + '.');
      currentComponent.setState({
        miner: $.miner,
        buttonDisabled: false,
        address: address,
        doMining: true,
        showProgress: false
      });
      const poolMiningHost = this.props.poolServer;
      const poolMiningPort = this.props.poolPort;
      window.Nimiq.Log.i(
        'Nimiqpocket',
        `Connecting to pool ${poolMiningHost}:${poolMiningPort}.`
      );
      $.miner.connect(
        poolMiningHost,
        poolMiningPort
      );
    }

     const _onConsensusLost = () => {
      if (currentComponent.progressPercent < 100) {
        currentComponent.updateMsg('Consensus lost.');
      } else {
        currentComponent.updateMsg('Finished.');
      }
      currentComponent.setState({
        buttonDisabled: true,
        doMining: false,
        showProgress: false
      });
      let miner = currentComponent.state.miner;
      miner.stopWork();
    }

   const _onMinerStarted = () => {
      currentComponent.setState({
        hashRate: currentComponent.state.miner.hashrate
      });
    }

   const _onHashRateChanged = () => {
      let newHashRate = currentComponent.state.miner.hashrate;
      let currentHashCount = currentComponent.state.totalHashCount;
      let currentElapsed = currentComponent.state.totalElapsed;
      let newHashCount =
        currentHashCount +
        currentComponent.state.miner._lastHashCounts[
          currentComponent.state.miner._lastHashCounts.length - 1
        ];
      let newElapsed =
        currentElapsed +
        parseInt(
          currentComponent.state.miner._lastElapsed[
            currentComponent.state.miner._lastElapsed.length - 1
          ],
          10
        );
      let totalHashCount = parseInt(newHashCount, 10);
      let progressPercent = parseInt(
        (totalHashCount / currentComponent.state.targetHash) * 100,
        10
      );
      let buttonDisabled = currentComponent.state.buttonDisabled;
      if (progressPercent >= 100) {
        progressPercent = 100;
        currentComponent.state.miner.stopWork();
        $.network.disconnect();
      }
      currentComponent.setState({
        hashRate: newHashRate,
        totalHashCount: totalHashCount,
        progressPercent: progressPercent,
        totalElapsed: newElapsed
      });
      if (currentComponent.state.displayMode === 'none') {
        console.log('Nimiqpocket progress ' + progressPercent + '%');
      }
    }

    const _onMinerStopped = () => {
      currentComponent.setState({
        hashRate: 0
      });
    }

    window.Nimiq.Log.instance.level = 'info';
    window.Nimiq.GenesisConfig.init(
      window.Nimiq.GenesisConfig.CONFIGS[this.state.network]
    );
    const networkConfig = new window.Nimiq.DumbNetworkConfig();
    $.consensus = await window.Nimiq.Consensus.nano(networkConfig);
    $.blockchain = $.consensus.blockchain;
    $.accounts = $.blockchain.accounts;
    $.mempool = $.consensus.mempool;
    $.network = $.consensus.network;

    try {
      $.wallet = {
        address: window.Nimiq.Address.fromUserFriendlyAddress(
          this.props.address
        )
      };
    } catch (error) {
      this.updateMsg('Invalid wallet address.');
    }

    const deviceId = window.Nimiq.BasePoolMiner.generateDeviceId(networkConfig);
    window.Nimiq.Log.i('Nimiqpocket', `Generated deviceId ${deviceId}.`);
    $.miner = new window.Nimiq.NanoPoolMiner(
      $.blockchain,
      $.network.time,
      $.wallet.address,
      deviceId
    );
    // $.miner = new Nimiq.SmartPoolMiner($.blockchain, $.accounts, $.mempool, $.network.time, $.wallet.address, deviceId);
    $.miner.threads = this.state.threadCount;
    this.setState({
      miner: $.miner
    });

    $.network.connect();
    this.updateMsg('Establishing nano consensus.');


    $.consensus.on('established', () =>_onConsensusEstablished());
    $.consensus.on('lost', () => _onConsensusLost());

    $.miner.on('start', () => _onMinerStarted());
    $.miner.on('hashrate-changed', () => _onHashRateChanged());
    $.miner.on('stop', () => _onMinerStopped());
  }
}

// WebMiner.defaultProps = {
//   address: '',
//   targetHash: Infinity,
//   width: 'auto',
//   height: 'auto',
//   autoStart: false,
//   displayMode: 'full',
//   border: true,
//   network: 'main',
//   poolServer: 'pool.nimiqpocket.com',
//   poolPort: 8444
// };

function HashRate(props) {
  return <h3>{props.display} H/s</h3>;
}

function StatusMessage(props) {
  let progressToggle = null;
  if (props.showProgress) {
    progressToggle = {
      display: 'inline'
    };
  } else {
    progressToggle = {
      display: 'none'
    };
  }
  return <p>{props.display}</p>;
}

function ThreadCount(props) {
  const style = {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5
  };
  let ts = 'threads';
  if (props.display === 1) {
    ts = 'thread';
  }
  return (
    <div>
      <div style={style}>
        {props.total} Hashes, {props.time} s, {props.display} {ts}
      </div>
    </div>
  );
}

export default WebMiner;
