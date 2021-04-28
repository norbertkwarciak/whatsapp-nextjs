import { useAuthState }       from 'react-firebase-hooks/auth';
import { useCollection }      from 'react-firebase-hooks/firestore';
import { useRouter }          from 'next/router';
import styled                 from 'styled-components';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon           from '@material-ui/icons/MoreVert';
import AttachFileIcon         from '@material-ui/icons/AttachFile';

import Message                from './Message';
import { auth, db }           from '../firebase';


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
    }
  };

  return (
    <Container>
      <Header>
        <Avatar />
        <HeaderInformation>
          <h3>Rec Email</h3>
          <p>Last seen ...</p>
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
        <EndOfMessage />
      </MessageContainer>
    </Container>
  )
}

const Container = styled.div``;

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

const MessageContainer = styled.div``;

const EndOfMessage = styled.div``;
