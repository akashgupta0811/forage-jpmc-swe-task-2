import React, { Component } from "react";
import DataStreamer, { ServerRespond } from "./DataStreamer";
import Graph from "./Graph";
import "./App.css";

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[];
  showGraph: boolean; // Added property showGraph of type boolean
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  interval: NodeJS.Timeout | undefined; // Store the interval object

  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    return <Graph data={this.state.data} />;
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      // Update the state by creating a new array of data that consists of
      // Previous data in the state and the new data from server
      if (serverResponds.length === 0) {
        // No more data available, stop fetching
        this.stopStreamingData();
      } else {
        this.setState({ data: [...this.state.data, ...serverResponds] });
      }
    });
  }

    /**
   * Start fetching data from the server continuously
   */
    startStreamingData() {
      this.interval = setInterval(() => {
        this.getDataFromServer();
      }, 100); // Fetch data every 100ms
    }
  
    /**
     * Stop fetching data from the server
     */
    stopStreamingData() {
      if (this.interval) {
        clearInterval(this.interval); // Clear the interval
        this.interval = undefined; // Reset the interval variable
      }
    }
    
  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">Bank & Merge Co Task 2</header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {
              this.setState({ showGraph: true }); // Update showGraph to true
              this.startStreamingData();// Start fetching data continuously
            }}
          >
            Start Streaming Data
          </button>
          {this.state.showGraph && (
            <div className="Graph">{this.renderGraph()}</div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
