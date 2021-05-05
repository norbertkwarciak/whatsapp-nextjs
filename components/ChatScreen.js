import { useState, useRef }   from 'react';
import { useAuthState }       from 'react-firebase-hooks/auth';
import { useCollection }      from 'react-firebase-hooks/firestore';
import TimeAgo                from 'timeago-react';
import { useRouter }          from 'next/router';
import styled                 from 'styled-components';
import firebase               from 'firebase';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon           from '@material-ui/icons/MoreVert';
import AttachFileIcon         from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon     from '@material-ui/icons/InsertEmoticon';
import MicIcon                from '@material-ui/icons/Mic';

import Message                from './Message';
import { auth, db }           from '../firebase';
import getRecipientEmail      from '../utils/getRecipientEmail';


export default function ChatScreen({chat, messages}) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(router.query.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection('users')
      .where('email', '==', getRecipientEmail(chat.users, user))
  );

  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  };

  const sendMessage = e => {
    e.preventDefault();

    // update last seen...
    db.collection('users').doc(user.uid).set({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    }, {merge: true})

    db.collection('chats').doc(router.query.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL
    })

    setInput('');
    scrollToBottom();
  };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map(message => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime()
          }}
        />
      ))
    } else {
      return JSON.parse(messages).map(message => (
        <Message
          key={message.id}
          user={message.user}
          message={message}
        />
      ))
    }
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user)

  return (
    <Container>
      <Header>
        {recipient
          ? <Avatar src={recipient?.photoUrl} />
          : <Avatar>{recipientEmail[0]}</Avatar>
        }
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot
            ? <p>
                Last active:
                {' '}
                {recipient?.lastSeen?.toDate()
                  ? <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                  : 'Unavailable'
                }
              </p>
            : <p>Loading Last active...</p>
          }
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={e => setInput(e.target.value)} />
        <button
          disabled={!input}
          type="submit"
          onClick={sendMessage}
          hidden
        >
          Send message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  )
}

const Container = styled.div``;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 20px;
  padding: 20px;
  background-color: whitesmoke;
  margin-left: 15px;
  margin-right: 15px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 11px;
  height: 80px;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 100;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  flex: 1;
  margin-left: 15px;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;
