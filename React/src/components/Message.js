import React from 'react';

const Message = ({chat, user}) => (
    <li className={`chat ${user.toLowerCase() === chat.username.toLowerCase() ? "right" : "left"}`}>
        {user.toLowerCase() !== chat.username.toLowerCase() && chat.username + ": "}
        {chat.content}
    </li>

);

export default Message;