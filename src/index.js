import React, { Suspense } from 'react'
import { Spin } from 'antd'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import './i18n'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <Suspense
    fallback={
      <div className="nimiqpocket">
        <div className="demo">
          <div className="circle">
            <div className="inner" />
          </div>
          <div className="circle">
            <div className="inner" />
          </div>
          <div className="circle">
            <div className="inner" />
          </div>
          <div className="circle">
            <div className="inner" />
          </div>
          <div className="circle">
            <div className="inner" />
          </div>
        </div>
      </div>
    }
  >
    <App />{' '}
  </Suspense>,
  document.getElementById('root')
)
registerServiceWorker()
