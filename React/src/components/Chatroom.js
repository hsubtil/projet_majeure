import React from 'react';
import ReactDOM from 'react-dom';
import './Chatroom.css';
import Message from './Message.js'; 

class Chatroom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            user: localStorage.getItem("user"),
            code: localStorage.getItem("selectedgroup_code"),
            token: localStorage.getItem("token")
        };
        this.socket =  props.socket.socket;    
    }


    componentWillMount(){
        var self = this; 

        this.socket.on('load_messages_reply', function (data){
            console.log('load_messages_reply');  
            self.displayAllMessages(data,self);   
        });
 
        this.socket.on('new_message_available', function (data){
            console.log('new_message_available');
            self.displayNewMessage(data,self);            
        });    

        this.submitMessage = this.submitMessage.bind(this);
        this.displayAllMessages = this.displayAllMessages.bind(this);
        this.displayNewMessage = this.displayNewMessage.bind(this);
        this.loadMessages(this.state.token, this.state.code);
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

    displayAllMessages(data, obj){
        Object.keys(data).forEach(function(key) {
            var val = data[key];
            var user = val['user'];
            var content = val['content'];
            obj.setState({
                chats: obj.state.chats.concat([{
                username: user,
                content: content,
                }])
            });
        });
    }

    displayNewMessage(data,obj){
        var user = data['user'];
        var content = data['content'];

        obj.setState({
            chats: obj.state.chats.concat([{
            username: user,
            content: content,
            }])
        });
    }

    loadMessages(token, code) {
        console.log("loadMessages");
 
        this.socket.emit('load_messages', {
                "token": token
                , 'code': code
            }) 
    }

    sendMessage(token, content, code, user, date ){
         console.log("sendMessage, code: " + code + ",user: "+ user + ",date: " + date + ",content: " + content);

         this.socket.emit('new_message', {
                "token": token
                ,'msg': {'code': code, 'user': user, 'date': date, 'content': content}
            })
    }

    submitMessage(e) {
        e.preventDefault();
        console.log("submitMessage");
        console.log(ReactDOM.findDOMNode(this.refs.msg).value);
        this.sendMessage(this.state.token, ReactDOM.findDOMNode(this.refs.msg).value, this.state.code, this.state.user, "");
        ReactDOM.findDOMNode(this.refs.msg).value = "";
    }

    render() {
        const username = this.state.user;
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