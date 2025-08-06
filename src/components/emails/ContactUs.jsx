import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Heading,
} from '@react-email/components';

export default function ContactEmail({ name, email, message, subject }) {
  return (
    <Html>
      <Head />
      <Preview>New contact message from {name}</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '20px' }}>
          <Heading>📨 New Contact Message</Heading>
          <Text><strong>Name:</strong> {name}</Text>
          <Text><strong>Email:</strong> {email}</Text>
          <Text><strong>Subject:</strong> {subject}</Text>
          <Text><strong>Message:</strong></Text>
          <Text style={{ whiteSpace: 'pre-line' }}>{message.replace(/\n/g, '<br />')}</Text>
        </Container>
      </Body>
    </Html>
  );
}
