import React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Button, Tailwind } from '@react-email/components';

interface TeamInviteEmailProps {
  inviterName: string;
  workspaceName: string;
  inviteLink: string;
}

export function TeamInviteEmail({ inviterName, workspaceName, inviteLink }: TeamInviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Join {workspaceName} on ForgeAI</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-xl">
            <Text className="text-2xl font-bold tracking-tight mb-4">
              You've been invited!
            </Text>
            <Text className="text-base text-gray-600 mb-6">
              <strong className="text-gray-900">{inviterName}</strong> has invited you to collaborate in the <strong className="text-gray-900">{workspaceName}</strong> workspace on ForgeAI Prometheus.
            </Text>
            <Section className="text-center my-6">
              <Button href={inviteLink} className="bg-indigo-600 text-white rounded-md px-6 py-3 font-semibold no-underline">
                Accept Invitation
              </Button>
            </Section>
            <Text className="text-sm text-gray-500">
              This link is tied exclusively to your email and cannot be forwarded. 
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default TeamInviteEmail;
