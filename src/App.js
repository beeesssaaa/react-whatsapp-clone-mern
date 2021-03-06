import {React, useEffect, useState} from "react";
import Pusher from 'pusher-js';
import './App.css';
import Sidebar from "./Sidebar";
import Chat from './Chat'
import axios from "./axios";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('/messages/sync')
      .then(response =>{
        console.log(response.data)
        setMessages(response.data);
      })
  }, []);

  useEffect(() => {
    var pusher = new Pusher('xxxxxxxxxxxx', {
      cluster: 'ap3'
    });

    var channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage])
    });
    
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
    
  }, [messages]);

  console.log('messages', messages)
  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        {/* Chat component */}
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
