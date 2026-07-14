import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface TrialStatusEmailProps {
  studentName: string;
  status: "approved" | "rejected";
  academyName?: string;
  dashboardUrl?: string;
}

export const TrialStatusEmail = ({
  studentName = "Student",
  status = "approved",
  academyName = "Master Farooq's Club",
  dashboardUrl = "https://your-domain.com/dashboard", // Default fallback, should be passed dynamically if possible
}: TrialStatusEmailProps) => {
  const isApproved = status === "approved";
  const previewText = isApproved
    ? `Great news! Your trial class request has been approved.`
    : `Update regarding your trial class request at ${academyName}.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>{academyName}</Heading>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hi {studentName},</Text>

            {isApproved ? (
              <>
                <Text style={paragraph}>
                  Great news! Your trial class request has been <strong>approved</strong>.
                </Text>
                <Text style={paragraph}>
                  We are excited to welcome you to the academy. Please log in to your dashboard for further details on scheduling your class and what to bring.
                </Text>
                <Section style={buttonContainer}>
                  <Button href={dashboardUrl} style={button}>
                    Go to Dashboard
                  </Button>
                </Section>
              </>
            ) : (
              <>
                <Text style={paragraph}>
                  Thank you for your interest in {academyName}.
                </Text>
                <Text style={paragraph}>
                  Unfortunately, we cannot accommodate your trial request at this time Or we found your identity to be falsified. Request for a trial class again with proper information and we will try to accommodate you.
                </Text>
              </>
            )}

            <Hr style={hr} />

            <Text style={footer}>
              Best regards,<br />
              The {academyName} Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TrialStatusEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  maxWidth: "580px",
};

const header = {
  background: "linear-gradient(to right, #ef4444, #f59e0b)", // Red to Amber gradient
  padding: "32px 20px",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  letterSpacing: "0.5px",
};

const content = {
  padding: "32px 40px",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#333333",
  marginBottom: "24px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#555555",
  marginBottom: "24px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  background: "linear-gradient(to right, #ef4444, #f59e0b)",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 28px",
  fontWeight: "bold",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer = {
  fontSize: "14px",
  color: "#8898aa",
  lineHeight: "22px",
};
