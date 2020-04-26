import React from 'react';
import './App.css';

var apigClientFactory = require('./apigClient').default;

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class ChatBox extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      messages : [],
      messageToSend: "",
      apigClient : null,
      member: {
        username: "User",
        color: randomColor()
      }
    }

    this.sendMessage = this.sendMessage.bind(this);
    this.changeMessage = this.changeMessage.bind(this);

    this.drone = new window.Scaledrone("ntBW8mNeY82G4H9A", {
      data: this.state.member
    });

    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  changeMessage(event) {
    this.setState({
      messageToSend : event.target.value
    })
  }

  sendMessage() {
    let newMessage = this.state.messageToSend;
    this.setState({
      messages : this.state.messages.concat(newMessage)
    });

    this.setState({
      messageToSend: ""
    });

    
    let UnstructuredMessage = {
      "id" : "0",
      "text" : newMessage,
      "timestamp" : Date(Date.now()).toString()
    }
    
    let Message = {
        "type" : "string",
        "unstructured" : UnstructuredMessage
    }
    
    let botRequest = {
        "messages": [Message]
    }

    this.state.apigClient.chatbotPost(null, botRequest)
    .then((response) => {
      let responseMessage = JSON.parse(response.data.body).messages[0].unstructured.text;
      this.setState({
        messages : this.state.messages.concat(responseMessage)
      });
    })
    .catch((result) => {
      console.error(result);
    });
  }

  componentDidMount() {
    var apigClient = apigClientFactory.newClient({
      apiKey: '3PQW9K7GB44nRUE6q8jqL3QaokV1bKApNqBVegsc'
    });

    this.setState({
      apigClient : apigClient
    });
  }

  renderMessage(message, index) {
    return (
      <div className="App">
      <div className="App-header">
          <h1>Dining Concierge</h1>
        </div>
          {/* <div className="card d-flex flex-column align-items-end" style={{height:'90%'}}>
            <ul className="Messages-list">
                {this.state.messages.map((message, index) =>
                  // <ChatBubble message={message} />
                  <li className={"Messages-message bot"}>
                      <div className="Message-content" key={index} >
                        <div className="text">
                          {message}
                          
                        </div>
                  </div>
                  </li>
                  )}
              </ul>
          </div> */}
          <li className={"Messages-message"}>
      {/* <span
        className="avatar"
        style={{backgroundColor: member.clientData.color}}
      /> */}
        <div className="Message-content" key = {index}>
          <div className="username">
            {this.statemember.clientData.username}
          </div>
          <div className="text">{message}</div>
        </div>
      </li>

          <div className="Input">
          <input
            onChange={this.changeMessage}
            value={this.state.messageToSend}
            type="text"
            placeholder="Enter your message and press ENTER"
            autoFocus="{true}"
          />
          <button onClick={this.sendMessage} > Send </button>
      </div>
          </div>

    )
  }

  render() {
    return (
      <ul className="Messages-list">
        {this.state.messages.map((m, index) => 
          <li className={"Messages-message"}>
      {/* <span
        className="avatar"
        style={{backgroundColor: member.clientData.color}}
      /> */}
        <div className="Message-content" key = {index}>
          <div className="username">
            {this.statemember.clientData.username}
          </div>
          <div className="text">{message}</div>
        </div>
      </li>

          <div className="Input">
          <input
            onChange={this.changeMessage}
            value={this.state.messageToSend}
            type="text"
            placeholder="Enter your message and press ENTER"
            autoFocus="{true}"
          />
          <button onClick={this.sendMessage} > Send </button>
      </div>)}
      </ul>
    );
  }

  
}

function App() {
  return (
        <div className="col m-4">
          <ChatBox />
        </div>
  );
}

export default App;
