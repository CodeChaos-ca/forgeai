import React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Button, Tailwind } from '@react-email/components';

interface MagicLinkEmailProps {
  magicLink: string;
  ipAddress?: string;
}

export function MagicLinkEmail({ magicLink, ipAddress }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your ForgeAI Secure Login Link</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-xl">
            <Text className="text-xl font-bold tracking-tight mb-4">
              Login to ForgeAI
            </Text>
            <Text className="text-base text-gray-600 mb-6">
              Click the button below to authenticate your session. This link acts as a secure, one-time passcode and will expire in 60 minutes.
            </Text>
            <Section className="text-center my-6">
              <Button href={magicLink} className="bg-indigo-600 text-white rounded-md px-6 py-3 font-semibold no-underline">
                Sign In Securely
              </Button>
            </Section>
            {ipAddress && (
              <Text className="text-xs text-gray-400 mt-8">
                Request originated from IP: {ipAddress}. If you did not request this, you may safely ignore this email.
              </Text>
            )}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default MagicLinkEmail;
