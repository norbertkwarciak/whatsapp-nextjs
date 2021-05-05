import { useAuthState } from 'react-firebase-hooks/auth';
import styled           from 'styled-components';
import moment           from 'moment';
import { auth }         from '../firebase';


function Message({user, message}) {
  const [userLoggedIn] = useAuthState(auth);
  const MessageType = user === userLoggedIn.email ? Sender : Receiver;

  return (
    <Container>
      <MessageType>
        {message.message}
        <Timestamp>{message.timestamp ? moment(message.timestamp).format('LT') : '...'}</Timestamp>
      </MessageType>
    </Container>
  )
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  padding-bottom: 26px;
  margin: 10px;
  border-radius: 8px;
  min-width: 60px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
  text-align: left;
  background-color: whitesmoke;
`;

const Timestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: right;
  white-space: nowrap;
`;
