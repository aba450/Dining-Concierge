import React from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";

var apigClientFactory = require('./apigClient').default;

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class ChatBox extends React.Component {

  constructor(){
    super();
    this.state = {
      messages : [],
      messageToSend: "",
      apigClient : null,
      // member: {
      //   username: "User",
      //   color: randomColor()
      // }
      sender: 'user'
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
    let message = {
      text: newMessage,
      sender: 'user'
    }
    this.setState({
      messages : this.state.messages.concat(message)
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

  // renderMessage(message) {
  //   console.log(message)
  //   const {member, text} = message;
  //   const {currentMember} = this.props;
  //   const messageFromMe = member.id === currentMember.id;
  //   const className = messageFromMe ?
  //     "Messages-message currentMember" : "Messages-message";
  //   return (
  //     <li className={className}>
  //     {/* <span
  //       className="avatar"
  //       style={{backgroundColor: member.clientData.color}}
  //     /> */}
  //       <div className="Message-content">
  //         <div className="username">
  //           {member.clientData.username}
  //         </div>
  //         <div className="text">{text}</div>
  //       </div>
  //     </li>
  //   );
  // }


  render() {
    console.log('messages', this.state.messages)
    const className = this.state.sender === 'user' ?
      "Messages-message currentMember" : "Messages-message bot";
    return (
      <div className="App">
      <div className="App-header">
          <h1>Dining Concierge</h1>
        </div>
          <div className="card d-flex flex-column align-items-end" style={{height:'90%'}}>
            <ul className="Messages-list">
                {this.state.messages.map((message, index) =>
                  // <ChatBubble message={message} />
                  <li className={className}>
                      <div className="Message-content" key={index} >
                        <div className="text">
                          {message.text}
                        </div>
                  </div>
                  </li>
                  )}
              </ul>
          </div>
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

      //     <div className="App">
      //   <div className="App-header">
      //     <h1>Dining Concierge</h1>
      //   </div>
      //   <Messages
      //     messages={this.state.messages}
      //     currentMember={this.state.member}
      //   />
      //   <div className="Input">
      //      <input
      //       onChange={this.changeMessage}
      //       value={this.state.messageToSend}
      //       type="text"
      //       placeholder="Enter your message and press ENTER"
      //       autoFocus="{true}"
      //     />
      //     <button onClick={this.sendMessage} > Send </button>
      // </div>
      // </div>




    )
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
