import React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Row, Column, Hr, Tailwind } from '@react-email/components';

interface BillingReceiptEmailProps {
  customerName: string;
  invoiceId: string;
  date: string;
  amount: number;
  currency: string;
  pdfUrl?: string;
}

export function BillingReceiptEmail({ customerName, invoiceId, date, amount, currency, pdfUrl }: BillingReceiptEmailProps) {
  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);

  return (
    <Html>
      <Head />
      <Preview>Receipt for your ForgeAI Subscription</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-xl">
            <Text className="text-2xl font-bold tracking-tight mb-2">
              Payment Receipt
            </Text>
            <Text className="text-base text-gray-600 mb-6">
              Hi {customerName}, this is a receipt for your recent payment to ForgeAI.
            </Text>
            
            <Section className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <Row>
                <Column>
                  <Text className="text-sm font-semibold text-gray-500 m-0">Amount Paid</Text>
                  <Text className="text-xl font-bold m-0 mt-1">{formattedAmount}</Text>
                </Column>
                <Column>
                  <Text className="text-sm font-semibold text-gray-500 m-0">Date</Text>
                  <Text className="text-base font-medium m-0 mt-1">{date}</Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-gray-200 my-6" />

            <Row className="mb-2">
              <Column><Text className="text-sm font-medium text-gray-600 m-0">Invoice ID</Text></Column>
              <Column align="right"><Text className="text-sm font-mono text-gray-900 m-0">{invoiceId}</Text></Column>
            </Row>
            <Row className="mb-2">
              <Column><Text className="text-sm font-medium text-gray-600 m-0">ForgeAI Prometheus Tier</Text></Column>
              <Column align="right"><Text className="text-sm text-gray-900 m-0">{formattedAmount}</Text></Column>
            </Row>

            <Hr className="border-gray-200 my-6" />

            <Text className="text-sm text-gray-500">
              {pdfUrl ? `You can download a PDF copy of this receipt at: ${pdfUrl}` : 'If you require a PDF, please check your billing dashboard.'}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default BillingReceiptEmail;
