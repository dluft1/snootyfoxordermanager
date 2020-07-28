import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import './Home.css';
import * as $ from 'jquery';

const Home = React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <MainView />
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

class MainView extends React.Component {
  render() {
    return (
      <Router>
        <Header />
        <Route path="/neworders" component={NewOrders} />
        <Route path="/" component={NewOrders} />
        {/* <Route path="/openorders" component={OpenOrders} /> */}
        {/*<Route path="/closedorders" component={ClosedOrders} /> */}
      </Router>
    )
  }
}

class Header extends React.Component {
  render() {
    return (
      <Router>
        <div className="headerMenu">
          <NavLink exact to="/"><IonButton color="primary" size="large" className="headerButton">New Orders</IonButton></NavLink>
          <NavLink to="/openorders"><IonButton color="primary" size="large" className="headerButton">Open Orders</IonButton></NavLink>
          <NavLink to="/closedorders"><IonButton color="primary" size="large" className="headerButton">Closed Orders</IonButton></NavLink>
        </div>
      </Router>
    )
  }
}

class NewOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrders: []
    }
  }

  componentDidMount() {
    console.log("Menu Orders Mounted");
    let currentComponent = this;
    var finalArray = new Array();
    $.post('http://localhost:8080/snootyordermanager/index.php', { action: "update", component: "new" }, function (response) {
      var temp = JSON.parse(response);
      currentComponent.setState({ newOrders: temp })
      console.log("Returned data from PHP: " + response);

      var counter = 0;
      var i;
      for ( i = 0; i < temp.length; i++) {
        console.log(temp[0]);
         var tempFinal = new Array();
         tempFinal.push(temp[counter]);

        if (temp[i] == tempFinal[0].ordernumber) {
          tempFinal.push(temp[i]);
        }
        else {
          console.log(tempFinal);
          finalArray.push(tempFinal);
          counter = i;
          tempFinal = [];
          tempFinal.push(temp[i]);
          if (i === temp.length)
          {
            finalArray.push(tempFinal);
          }

        }
      }

      console.log(finalArray);
    })


  }

  search(table) {
    console.log("Search function entered");
    let currentComponent = this;
    $.post('http://localhost:8080/snootyordermanager/index.php', { action: "search", component: "new", table: table }, function (response) {
      let temp = JSON.parse(response);
      currentComponent.setState({ newOrders: temp });
    })
  }

  render() {
    return (
      <div>
        <SearchOrders search={this.search.bind(this)} />
        <ReturnedTables orderData={this.state.newOrders} />
      </div>
    )
  }
}

class SearchOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tablenumber: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    console.log("We got in here");
    this.setState({ tablenumber: e.target.value });
  }
  render() {
    return (
      <div className="searchTable">
        <table>
          <tr>
            <td>Table: <input type="number" value={this.state.tablenumber} max="4" onChange={this.handleChange} style={{ color: "black" }} /></td>
            <td style={{ verticalAlign: "bottom" }}><IonButton size="small" className="searchButton" onClick={() => this.props.search(this.state.tablenumber)}>Search</IonButton></td>
          </tr>
        </table>
      </div>
    )
  }
}

class ReturnedTables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: []
    }
  }

  componentDidMount() {
    this.setState({ orderData: this.props.orderData })
  }

  ordersTableData({ ordernumber, menuitem }) {
    console.log(this.props.orderData[0].ordernumber);
    return (
      <tr key={ordernumber}>
        <td>{menuitem}</td>
      </tr>
    )
  }
  render() {
    let currentComponent = this;
    return (
      <div>
        <table>
          <tbody>
            {currentComponent.props.orderData.map(currentComponent.ordersTableData.bind(currentComponent))}
          </tbody>
        </table>
      </div>
    )
  }
}


export default Home;
