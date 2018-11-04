import React, { Component } from "react";
import { Card, Spin, Icon } from "antd";
import { translate, Trans } from "react-i18next";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import { humanHashes } from "../Helper/statsFormat";
class MarketStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMarketStatsLoading: true,
      market: {},
      supply: {}
    };
  }
  async componentDidMount() {
    try {
      const [marketStats] = await Promise.all([
        axios.get("https://api.nimiqpocket.com:8080/api/marketStats")
      ]);

      this.setState({
        isMarketStatsLoading: false,
        supply: marketStats.data[0],
        market: marketStats.data[1]
      });
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    const { t, i18n } = this.props;

    const changeLanguage = lng => {
      i18n.changeLanguage(lng);
    };
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    if (this.state.isMarketStatsLoading)
      return (
        <Card
          title={t("dashboard.market.title")}
          bordered={false}
          style={{ width: "90%" }}
        >
          <Spin indicator={antIcon} />
        </Card>
      );
    return (
      <Card
        title={t("dashboard.market.title")}
        extra={
          <p>
            Power by{" "}
            <a href="https://api.nimiqx.com/" target="_blank">
              NimiqX
            </a>
          </p>
        }
        bordered={false}
        style={{ width: "90%" }}
        className="network-stats"
      >
        <p>
          Market Cap :
          <span>
            <CurrencyFormat
              value={this.state.supply.market_cap}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
            />
          </span>{" "}
        </p>
        <p>
          USD :{" "}
          <span>
            {" "}
            <CurrencyFormat
              value={this.state.market.usd}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
            />{" "}
          </span>
        </p>
        <p>
          EUR :{" "}
          <span>
            <CurrencyFormat
              value={this.state.market.eur}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"€"}
            />{" "}
          </span>
        </p>
        <p>
          CNY :{" "}
          <span>
            {" "}
            <CurrencyFormat
              value={this.state.market.cny}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"¥"}
            />{" "}
          </span>
        </p>
      </Card>
    );
  }
}
export default translate("translations")(MarketStats);
