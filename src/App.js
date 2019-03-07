import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Graph from "./components/graph";
const ETHER_API_KEY = `${process.env.REACT_APP_ETHERSCAN_API}`;
const CRYPTO_API_KEY = `${process.env.REACT_APP_CRYPROCOMPARE_API}`;
const ea = require("etherscan-api").init(ETHER_API_KEY);
const cc = require("cryptocompare");
cc.setApiKey(CRYPTO_API_KEY);

//TODO:

class App extends Component {
  state = {
    data: [],
    ddlValue: "",
    multiplier: 1,
    showResults: false
  };

  retreiveEthPrice(currency) {
    if (currency === "USD") {
      cc.price("ETH", "USD").then(prices => {
        this.autoRefresh(prices.USD);
      });
    } else if (currency === "CAD") {
      cc.price("ETH", "CAD").then(prices => {
        this.autoRefresh(prices.CAD);
      });
    } else {
      setTimeout(() => {
        this.autoRefresh(1);
      }, 0);
    }
  }

  autoRefresh(multValue) {
    var multiplier = multValue;
    this.setState({ multiplier });
    if (
      typeof this.state.address != "undefined" ||
      this.state.address != null
    ) {
      this.handleRefresh(this.state.address, this.state.multiplier);
    }
  }

  handleRefresh(address, multiplier) {
    var that = this;
    var balance = ea.account.txlist(address);
    balance
      .then(function(balanceData) {
        let data = [];
        var inc = 0;
        const bal = balanceData.result;
        bal.map(dat => {
          if (dat.value > 0) {
            var etherVal = Web3.utils.fromWei(dat.value, "ether");
            etherVal = etherVal * multiplier;
            data.push([inc, etherVal]);
            inc++;
          }
          return null;
        });
        that.setState({ data, address });
        that.onNoErrorsReturned();
      })
      .catch(function(err) {
        if (err === "NOTOK") {
          that.setState({
            errorMessage:
              "No transactions recorded for this address on the main ethereum network",
            showResults: false
          });
        } else {
          that.setState({ errorMessage: err, showResults: false });
        }
      });
  }

  handleTextChange = inputChange => {
    this.setState({ tempAddress: inputChange.target.value });
  };

  handleDDLChange = inputChange => {
    this.retreiveEthPrice(inputChange.target.value);
  };

  onNoErrorsReturned() {
    this.setState({ showResults: true, errorMessage: "" });
  }

  // handletest = () => {
  //   const { multiplier } = this.state;
  // };

  render() {
    return (
      <React.Fragment>
        <main className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-12 content">
              <button
                onClick={() => {
                  this.handleRefresh(
                    "0x4092678e4E78230F46A1534C0fbc8fA39780892B",
                    this.state.multiplier
                  );
                }}
                className="btn btn-primary btn-md"
              >
                Odyssey Coin
              </button>
              <button
                onClick={() => {
                  this.handleRefresh(
                    "0xD1CEeeeee83F8bCF3BEDad437202b6154E9F5405",
                    this.state.multiplier
                  );
                }}
                className="btn btn-primary btn-md"
              >
                Dice2Win
              </button>
              <button
                onClick={() => {
                  this.handleRefresh(
                    "0xFa52274DD61E1643d2205169732f29114BC240b3",
                    this.state.multiplier
                  );
                }}
                className="btn btn-primary btn-md"
              >
                Kraken_5
              </button>
            </div>

            <div className="col-xl-6 col-lg-12">
              <div className="input-group mt-2">
                <input
                  className="form-control"
                  onChange={this.handleTextChange}
                  type="text"
                  placeholder="Ether Address"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary btn-md float-right"
                    type="submit"
                    onClick={() => {
                      this.handleRefresh(
                        this.state.tempAddress,
                        this.state.multiplier
                      );
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-lg-12 mt-2">
              <select
                className="custom-select"
                onChange={this.handleDDLChange}
                value={this.state.value}
              >
                <option value="ETH">ETH</option>
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div id="display" className="col-md-12">
              {this.state.errorMessage ? (
                <p className="text-danger text-center mt-5">
                  {this.state.errorMessage}
                </p>
              ) : null}
              {this.state.showResults ? (
                <Graph balance={this.state.data} />
              ) : null}
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default App;

// TODO: Display error message when no data found in the list
