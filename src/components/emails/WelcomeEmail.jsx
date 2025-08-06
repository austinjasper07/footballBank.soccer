// /emails/WelcomeEmail.jsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Heading,
} from '@react-email/components';


export default function WelcomeEmail({ firstName }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Footballbank, {firstName}!</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial' }}>
        <Container style={{ padding: '20px', backgroundColor: '#fff' }}>
          <Heading style={{ color: '#1a202c' }}>
            👋 Hey {firstName},
          </Heading>
          <Text>
            Welcome to <strong>Footballbank.soccer</strong> — your all-in-one platform for football finance and game intelligence.
          </Text>
          <Text>You're officially on the team ⚽</Text>
        </Container>
      </Body>
    </Html>
  );
}
