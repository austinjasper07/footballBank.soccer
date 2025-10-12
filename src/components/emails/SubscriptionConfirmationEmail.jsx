import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Heading,
  Section,
  Button,
  Hr,
} from '@react-email/components';

export default function SubscriptionConfirmationEmail({ 
  customerName, 
  planName, 
  subscriptionId,
  amount,
  billingCycle,
  nextBillingDate,
  features 
}) {
  return (
    <Html>
      <Head />
      <Preview>Subscription Confirmed - {planName} Plan</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial' }}>
        <Container style={{ padding: '20px', backgroundColor: '#fff', maxWidth: '600px' }}>
          <Heading style={{ color: '#1a202c', textAlign: 'center' }}>
            🎉 Subscription Confirmed!
          </Heading>
          
          <Text style={{ fontSize: '16px', marginBottom: '20px' }}>
            Hi {customerName},
          </Text>
          
          <Text>
            Welcome to your new <strong>{planName}</strong> subscription! You now have access to all premium features.
          </Text>

          <Section style={{ backgroundColor: '#e8f5e8', padding: '15px', margin: '20px 0', borderRadius: '8px' }}>
            <Text style={{ margin: '0', fontWeight: 'bold', color: '#2d5a2d' }}>Subscription Details</Text>
            <Text style={{ margin: '5px 0' }}><strong>Plan:</strong> {planName}</Text>
            <Text style={{ margin: '5px 0' }}><strong>Amount:</strong> {amount}</Text>
            <Text style={{ margin: '5px 0' }}><strong>Billing Cycle:</strong> {billingCycle}</Text>
            <Text style={{ margin: '5px 0' }}><strong>Next Billing:</strong> {nextBillingDate}</Text>
            <Text style={{ margin: '5px 0' }}><strong>Subscription ID:</strong> {subscriptionId}</Text>
          </Section>

          <Text style={{ fontWeight: 'bold', marginTop: '20px' }}>What's included in your plan:</Text>
          {features && features.map((feature, index) => (
            <Text key={index} style={{ margin: '5px 0', paddingLeft: '15px' }}>
              ✓ {feature}
            </Text>
          ))}

          <Section style={{ textAlign: 'center', margin: '30px 0' }}>
            <Button
              href="https://footballbank.soccer/profile"
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Access Your Dashboard
            </Button>
          </Section>

          <Hr style={{ margin: '20px 0' }} />
          
          <Text style={{ textAlign: 'center', color: '#666' }}>
            Need help? Contact our support team at support@footballbank.soccer
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
