import { useAuthState }   from 'react-firebase-hooks/auth';
import Head               from 'next/head';
import styled             from 'styled-components';

import Sidebar            from '../../components/Sidebar';
import ChatScreen         from '../../components/ChatScreen';
import getRecipientEmail  from '../../utils/getRecipientEmail';
import { auth, db }       from '../../firebase';


export default function Chat({chat, messages}) {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />

      <ChatContainer>
        <ChatScreen
          chat={chat}
          messages={messages}
        />
      </ChatContainer>
    </Container>
  )
}

export async function getServerSideProps(context) {
  const ref = db.collection('chats').doc(context.query.id);

  // prep messages on the server
  const messagesRes = await ref
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .get();

  const messages = messagesRes.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    .map(message => ({
      ...message,
      timestamp: message.timestamp.toDate().getTime()
    }))

  // prep the chats
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data()
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat
    }
  }
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; // IE and Edge
  scrollbar-width: none; // Firefox
`;