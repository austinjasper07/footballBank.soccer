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

export default function AdminOrderNotificationEmail({ 
  orderId, 
  customerName, 
  customerEmail,
  customerAddress,
  shippingAddress,
  items, 
  totalAmount, 
  orderDate,
  paymentStatus,
  stripeSessionId 
}) {
  return (
    <Html>
      <Head />
      <Preview>New Order Notification - {orderId}</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial' }}>
        <Container style={{ padding: '20px', backgroundColor: '#fff', maxWidth: '600px' }}>
          <Heading style={{ color: '#dc2626', textAlign: 'center' }}>
            🛍️ New Order Received
          </Heading>
          
          <Text style={{ fontSize: '16px', marginBottom: '20px', fontWeight: 'bold' }}>
            A new order has been placed on FootballBank.soccer
          </Text>

          <Section style={{ backgroundColor: '#f8f9fa', padding: '15px', margin: '20px 0' }}>
            <Text style={{ margin: '0', fontWeight: 'bold', color: '#dc2626' }}>Order Information</Text>
            <Text style={{ margin: '5px 0' }}><strong>Order ID:</strong> {orderId}</Text>
            <Text style={{ margin: '5px 0' }}><strong>Order Date:</strong> {orderDate}</Text>
            <Text style={{ margin: '5px 0' }}><strong>Total Amount:</strong> {totalAmount}</Text>
            <Text style={{ margin: '5px 0' }}><strong>Payment Status:</strong> {paymentStatus}</Text>
            <Text style={{ margin: '5px 0' }}><strong>Stripe Session:</strong> {stripeSessionId}</Text>
          </Section>

          <Section style={{ backgroundColor: '#e8f5e8', padding: '15px', margin: '20px 0' }}>
            <Text style={{ margin: '0', fontWeight: 'bold', color: '#2d5a2d' }}>Customer Information</Text>
            <Text style={{ margin: '5px 0' }}><strong>Name:</strong> {customerName}</Text>
            <Text style={{ margin: '5px 0' }}><strong>Email:</strong> {customerEmail}</Text>
            {customerAddress && (
              <>
                <Text style={{ margin: '10px 0 5px 0', fontWeight: 'bold' }}>Address:</Text>
                <Text style={{ margin: '2px 0' }}>{customerAddress.street}</Text>
                <Text style={{ margin: '2px 0' }}>{customerAddress.city}, {customerAddress.state} {customerAddress.postalCode}</Text>
                <Text style={{ margin: '2px 0' }}>{customerAddress.country}</Text>
              </>
            )}
          </Section>

          {shippingAddress && (
            <Section style={{ backgroundColor: '#fff3cd', padding: '15px', margin: '20px 0' }}>
              <Text style={{ margin: '0', fontWeight: 'bold', color: '#856404' }}>Shipping Address</Text>
              <Text style={{ margin: '5px 0' }}><strong>Name:</strong> {shippingAddress.name}</Text>
              <Text style={{ margin: '5px 0' }}>{shippingAddress.street}</Text>
              <Text style={{ margin: '5px 0' }}>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</Text>
              <Text style={{ margin: '5px 0' }}>{shippingAddress.country}</Text>
            </Section>
          )}

          <Text style={{ fontWeight: 'bold', marginTop: '20px' }}>Order Items:</Text>
          {items.map((item, index) => (
            <Section key={index} style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #e5e7eb' }}>
              <Text style={{ margin: '0', fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ margin: '5px 0' }}>Quantity: {item.quantity}</Text>
              <Text style={{ margin: '5px 0' }}>Unit Price: ${item.price}</Text>
              <Text style={{ margin: '5px 0', fontWeight: 'bold' }}>Subtotal: ${(item.price * item.quantity).toFixed(2)}</Text>
            </Section>
          ))}

          <Hr style={{ margin: '20px 0' }} />
          
          <Section style={{ textAlign: 'center', margin: '20px 0' }}>
            <Text style={{ fontWeight: 'bold', color: '#dc2626' }}>Action Required</Text>
            <Text style={{ margin: '10px 0' }}>
              Please process this order and update the order status in the admin dashboard.
            </Text>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              Admin Dashboard: https://footballbank.soccer/admin
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
