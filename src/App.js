import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Graph from "./components/graph";
const ETHER_API_KEY = `${process.env.REACT_APP_ETHERSCAN_API}`;
const CRYPTO_API_KEY = `${process.env.REACT_APP_CRYPROCOMPARE_API}`;
// TODO: Add switch from Mainnet to Testnet Ether
const ea = require("etherscan-api").init(ETHER_API_KEY);
const cc = require("cryptocompare");
cc.setApiKey(CRYPTO_API_KEY);

//TODO: Fix bug when trying to search smart contract transaction history

class App extends Component {
  state = {
    data: [],
    ddlValue: "",
    multiplier: 1,
    showResults: false,
    errorMessage: "",
    address: "",
    tempAddress: ""
  };

  // Applies a multiplier to values from the CryptoCompare API
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
      // TODO: Embrace async, instead of doing this hack
      setTimeout(() => {
        this.autoRefresh(1);
      }, 0);
    }
  }

  //
  autoRefresh(multiplier) {
    this.setState({ multiplier });
    if (
      typeof this.state.address != "undefined" ||
      this.state.address != null
    ) {
      this.handleRefresh(this.state.address, this.state.multiplier);
    }
  }

  handleRefresh(address, multiplier) {
    // TODO: Use bind() or ES6 functions instead of that=this hack
    var that = this;
    var balance = ea.account.txlist(address);
    balance
      .then(function(balanceData) {
        let data = [];
        var index = 0;
        const bal = balanceData.result;

        bal.map(dat => {
          if (dat.value > 0) {
            var etherVal = Web3.utils.fromWei(dat.value, "ether");
            etherVal = etherVal * multiplier;
            data.push([index, etherVal]);
            index++;
          }
          return null;
        });

        that.setState({ data, address });
        that.onNoErrorsReturned();
      })
      .catch(function(err) {
        // Catching the custom errors that come from the Etherscan API
        if (err === "NOTOK") {
          that.onErrorReturned(
            "No transactions recorded for this address on the main ethereum network"
          );
        } else {
          that.onErrorReturned(err);
        }
      });
  }

  handleTextChange = inputChange => {
    this.setState({ tempAddress: inputChange.target.value });
  };

  handleDDLChange = inputChange => {
    this.retreiveEthPrice(inputChange.target.value);
  };

  // I could just check if error message contains a value, but I decided to have a clear boolean to determine to show the results
  onNoErrorsReturned() {
    this.setState({ showResults: true, errorMessage: "" });
  }

  onErrorReturned(err) {
    this.setState({ showResults: false, errorMessage: err });
  }

  render() {
    return (
      <React.Fragment>
        <main className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-12 content">
              <button // Should move this to it's own sfc component class
                // A problem with onClick={() => {...}} is that "a different callback is created each time the LoggingButton renders"
                // https://reactjs.org/docs/handling-events.html
                // "We generally recommend binding in the constructor or using the class fields syntax, to avoid this sort of performance problem."
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
              <button // Should move this to it's own sfc component class
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
              <button // Should move this to it's own sfc component class
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
                  <button // imitation form, does not work when enter is pressed
                    // Should move this to it's own sfc component class
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
