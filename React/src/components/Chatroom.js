import React from 'react';
import ReactDOM from 'react-dom';
import './Chatroom.css';
import socketIOClient from 'socket.io-client';
import Message from './Message.js';
import Comm from "../tool/comm.js";

var request_url = "http://192.168.1.100:1337";


class Chatroom extends React.Component {
    constructor(props) {
        super(props);
        this.socket = "";

        this.state = {
            chats: []
        };

        var socket = socketIOClient.connect(request_url); //process.env.SOCKET_URL
        this.socket = socket;
        this.socket.uuid = "6969";
        console.log("SOCKETCONNECTION");
        console.log("this");
        console.log(this);

        var self = this;
        

        this.socket.on('load_messages_reply', function (data){

            console.log('load_messages_reply');
            console.log(data);

            Object.keys(data).forEach(function(key) {
                var val = data[key];
                var user = val['user'];
                var content = val['content'];
                //console.log("user: " + user + ",content: " + content);
                //console.log("self");
                //console.log(self);
                //regarder react socket io
                self.setState({
                    chats: self.state.chats.concat([{
                    username: user,
                    content: content,
                    }])
                });
            });     
        });

        this.socket.on('new_message_available', function (data){

            console.log('new_message_available');
            console.log(data); //{code: , user:, date: , content: }
            
            var user = data['user'];
            var content = data['content'];
            //console.log("user: " + user + ",content: " + content);
            //console.log("self");
            //console.log(self);
            //regarder react socket io
            self.setState({
                chats: self.state.chats.concat([{
                username: user,
                content: content,
                }])
            });
        });    

        this.submitMessage = this.submitMessage.bind(this);
        this.loadMessages();
    }

    componentDidMount() {
        this.scrollToBot();
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot() {
        ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
    }

    loadMessages() {
        console.log("loadMessages");
 
        this.socket.emit('load_messages', {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTNiY2FhYTExYmE5MTAwNWFlMTZhMzkiLCJlbWFpbCI6Im5hYmlsLmZla2lyQG9sLmNvbSIsIm5hbWUiOiJuYWJpbCIsInN1cm5hbWUiOiJmZWtpciIsImFkZHJlc3MiOiJBdmVudWUgZHUgc3RhZGUiLCJjcCI6IjY5MTEwIiwiY2l0eSI6IkRlY2luZXMiLCJjb3VudHJ5IjoiRnJhbmNlIiwiYmlydGhkYXkiOiIxOS0xMi0xOTkzIiwiaWF0IjoxNTE0MzkyODI4fQ.p3mOK9yNA4kwukTSKHP5bGnw2joUFQj_DhkefSRp3PI"
                , 'code': "a177a1f8-255d-40a1-a757-30ba22766b52"
            }) 
    }

    sendMessage(content){
        var code = "a177a1f8-255d-40a1-a757-30ba22766b52";
        var user = "Nabil";
        var date =""; 
         console.log("sendMessage, code: " + code + ",user: "+ user + ",date: " + date + ",content: " + content);

         this.socket.emit('new_message', {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTNiY2FhYTExYmE5MTAwNWFlMTZhMzkiLCJlbWFpbCI6Im5hYmlsLmZla2lyQG9sLmNvbSIsIm5hbWUiOiJuYWJpbCIsInN1cm5hbWUiOiJmZWtpciIsImFkZHJlc3MiOiJBdmVudWUgZHUgc3RhZGUiLCJjcCI6IjY5MTEwIiwiY2l0eSI6IkRlY2luZXMiLCJjb3VudHJ5IjoiRnJhbmNlIiwiYmlydGhkYXkiOiIxOS0xMi0xOTkzIiwiaWF0IjoxNTE0MzkyODI4fQ.p3mOK9yNA4kwukTSKHP5bGnw2joUFQj_DhkefSRp3PI"
                ,'msg': {'code': code, 'user': user, 'date': date, 'content': content}
            })
    }

    submitMessage(e) {
        e.preventDefault();
        console.log("submitMessage");
        console.log(ReactDOM.findDOMNode(this.refs.msg).value);
        this.sendMessage(ReactDOM.findDOMNode(this.refs.msg).value);
        ReactDOM.findDOMNode(this.refs.msg).value = "";
    }

    render() {
        const username = "Nabil";
        const { chats } = this.state;

        return (
            <div className="chatroom">
                <h3>Chat</h3>
                <ul className="chats" ref="chats">
                    {
                        chats.map((chat) => 
                            <Message chat={chat} user={username} />
                        )
                    }
                </ul>
                <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                    <input type="text" ref="msg" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default Chatroom;