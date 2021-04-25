import styled     from 'styled-components';
import { Circle } from 'better-react-spinkit';

export default function Loading() {
  return (
    <Container>
      <div>
        <Image
          src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c543.png"
          alt=""
          height={200}
        />
        <Circle color="#3cbc2b" size={60} />
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
`;

const Image = styled.img`
  margin-bottom: 10px;
`;

