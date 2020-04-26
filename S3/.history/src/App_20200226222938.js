import React from 'react';
import './App.css';

var apigClientFactory = require('./apigClient').default;

class ChatBox extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      messages : [],
      messageToSend: "",
      apigClient : null
    }

    this.sendMessage = this.sendMessage.bind(this);
    this.changeMessage = this.changeMessage.bind(this);
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

  render() {
    return (
      <div className="card h-100">
        <div className="card-body justify-content-bottom">
          <div className="card d-flex flex-column align-items-end" style={{height:'90%'}}>
            <div className="Messages-list">
                {this.state.messages.map((message, index) =>
                  // <ChatBubble message={message} />
                      <div className="card m-2" key={index} >
                        <div className="text">
                          {message}
                        </div>
                  </div>
                  )}
              </div>
          </div>
          <div className="d-flex justify-content-end mt-2" >
            <input type="text" value={this.state.messageToSend} onChange={this.changeMessage} className="Input" />
            <button onClick={this.sendMessage} className="btn btn-primary align-bottom">
              Send
            </button>
          </div>

        </div>
      </div>
    )
  }
}

function App() {
  return (
    <div className="container" >
      <div className="row justify-content-center" style={{height:700}}>
        <div className="col m-4">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}

export default App;
