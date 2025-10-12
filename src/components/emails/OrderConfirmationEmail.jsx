import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Heading,
  Section,
  Row,
  Column,
  Hr,
} from '@react-email/components';

export default function OrderConfirmationEmail({ 
  customerName, 
  orderId, 
  items, 
  totalAmount, 
  orderDate,
  shippingAddress 
}) {
  return (
    <Html>
      <Head />
      <Preview>Order Confirmation - {orderId}</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial' }}>
        <Container style={{ padding: '20px', backgroundColor: '#fff', maxWidth: '600px' }}>
          <Heading style={{ color: '#1a202c', textAlign: 'center' }}>
            🛍️ Order Confirmation
          </Heading>
          
          <Text style={{ fontSize: '16px', marginBottom: '20px' }}>
            Hi {customerName},
          </Text>
          
          <Text>
            Thank you for your purchase! We've received your order and are processing it now.
          </Text>

          <Section style={{ backgroundColor: '#f8f9fa', padding: '15px', margin: '20px 0' }}>
            <Text style={{ margin: '0', fontWeight: 'bold' }}>Order Details</Text>
            <Text style={{ margin: '5px 0' }}><strong>Order ID:</strong> {orderId}</Text>
            <Text style={{ margin: '5px 0' }}><strong>Order Date:</strong> {orderDate}</Text>
            <Text style={{ margin: '5px 0' }}><strong>Total Amount:</strong> {totalAmount}</Text>
          </Section>

          <Text style={{ fontWeight: 'bold', marginTop: '20px' }}>Items Ordered:</Text>
          {items.map((item, index) => (
            <Section key={index} style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f8f9fa' }}>
              <Text style={{ margin: '0', fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ margin: '5px 0' }}>Quantity: {item.quantity}</Text>
              <Text style={{ margin: '5px 0' }}>Price: ${item.price}</Text>
            </Section>
          ))}

          {shippingAddress && (
            <Section style={{ marginTop: '20px' }}>
              <Text style={{ fontWeight: 'bold' }}>Shipping Address:</Text>
              {shippingAddress.name && (
                <Text style={{ margin: '5px 0', fontWeight: 'bold' }}>{shippingAddress.name}</Text>
              )}
              <Text style={{ margin: '5px 0' }}>{shippingAddress.street}</Text>
              <Text style={{ margin: '5px 0' }}>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</Text>
              <Text style={{ margin: '5px 0' }}>{shippingAddress.country}</Text>
            </Section>
          )}

          <Hr style={{ margin: '20px 0' }} />
          
          <Text style={{ textAlign: 'center', color: '#666' }}>
            We'll send you another email when your order ships. If you have any questions, 
            please contact us at support@footballbank.soccer
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
