import React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Button, Img, Hr, Tailwind } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  loginUrl: string;
}

export function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to ForgeAI Prometheus</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-xl">
            <Section className="text-center mb-8">
              <Img src="https://forgeai.dev/logo.png" alt="ForgeAI" width="48" height="48" className="mx-auto" />
            </Section>
            <Text className="text-2xl font-bold tracking-tight mb-4">
              Welcome to the future, {name}.
            </Text>
            <Text className="text-base text-gray-600 mb-6 leading-relaxed">
              We're thrilled to have you aboard. ForgeAI Prometheus is an advanced self-evolving AI platform designed to dynamically adapt to your engineering standards. You can now scaffold projects, run robust multi-agent refactoring, and orchestrate zero-downtime server deployments seamlessly.
            </Text>
            <Section className="text-center my-6">
              <Button href={loginUrl} className="bg-indigo-600 text-white rounded-md px-6 py-3 font-semibold no-underline">
                Access Dashboard
              </Button>
            </Section>
            <Hr className="border-gray-200 my-6" />
            <Text className="text-sm text-gray-500 text-center">
              If you have any questions, simply reply to this email or join our community Discord.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default WelcomeEmail;
