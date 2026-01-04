"use client";

import React from "react";
import {
  Column,
  Row,
  Avatar,
  Text,
  IconButton,
  Heading,
  SmartLink,
} from "@once-ui-system/core";
import { content } from "@/resources";
import { FiPhone, FiMail, FiMessageCircle, FiVideo, FiGithub, FiLinkedin, FiGlobe } from "react-icons/fi";
import WeatherWidget from "@/components/WeatherWidget";
import DiscordWidget from "@/components/DiscordWidget";
import CustomCursor from "@/components/CustomCursor";
import { generateVCF, downloadVCF, shareContact } from "@/utils/contactUtils";
import { FiDownload, FiShare2 } from "react-icons/fi";

export default function Home() {
  const handleSaveContact = () => {
    const vcf = generateVCF({
      name: content.name,
      jobTitle: content.jobTitle,
      phone: content.phone,
      email: content.email,
      website: content.website,
      github: content.github,
      linkedin: content.linkedin,
    });
    downloadVCF(vcf, `${content.name.replace(' ', '_')}.vcf`);
  };

  const handleShareContact = () => {
    shareContact('https://your-domain.com', content.name);
  };

  return (
    <>
      <CustomCursor />
      <Column 
      fillWidth 
      fillHeight 
      horizontal="center" 
      vertical="center" 
      padding="24"
      style={{
        minHeight: "100vh",
        background: "url('/images/cover.jpg') center/cover no-repeat",
        backgroundColor: "#0a0a0a"
      }}
    >
      {/* iOS Contact Card Container - Frosted Glass */}
      <Column 
        radius="xl" 
        padding="32"
        gap="24"
        style={{
          width: "450px",
          background: "rgba(28, 28, 30, 0.65)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Profile Photo */}
        <Column fillWidth horizontal="center">
          <div style={{
            padding: "4px",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.2)"
          }}>
            {content.avatar && (
              <Avatar src={content.avatar} size="xl" style={{ width: "110px", height: "110px" }} />
            )}
          </div>
        </Column>

        {/* iOS Widgets Row - Weather and Date */}
        <Row fillWidth horizontal="center" gap="12" paddingX="16">
          {/* Weather Widget */}
          <WeatherWidget />

          {/* Date Widget */}
          <Column
            gap="4"
            padding="12"
            radius="l"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              minWidth: "90px",
              alignItems: "center"
            }}
          >
            <Text 
              variant="label-default-s" 
              style={{ 
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "11px"
              }}
            >
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short' }).toUpperCase()}
            </Text>
            <Text 
              variant="heading-strong-xl" 
              style={{ 
                color: "white",
                fontSize: "32px",
                lineHeight: "1"
              }}
            >
              {new Date().getDate()}
            </Text>
          </Column>
        </Row>

        {/* Name */}
        <Column fillWidth horizontal="center">
          <Heading 
            variant="heading-strong-xl" 
            align="center"
            style={{ color: "white" }}
          >
            {content.name || "Eli Waterkotte"}
          </Heading>
        </Column>

        {/* Job Title / Bio */}
        <Column fillWidth horizontal="center" paddingX="16">
          <Text 
            variant="body-default-m" 
            align="center"
            style={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            {content.jobTitle || "Applications Analyst I @ Illinois State University"}
          </Text>
        </Column>


        {/* Divider */}
        <div style={{ 
          width: "100%", 
          height: "1px", 
          background: "rgba(255, 255, 255, 0.1)",
          marginTop: "8px"
        }} />

        {/* Mobile */}
        <Column fillWidth gap="4">
          <Text 
            variant="label-default-xs" 
            style={{ 
              color: "rgba(255, 255, 255, 0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}
          >
            MOBILE
          </Text>
          <a href={`tel:${content.phone}`} style={{ textDecoration: "none" }}>
            <Text variant="body-default-m" style={{ color: "#3b82f6" }}>
              {content.phone || "(123) 456-7890"}
            </Text>
          </a>
        </Column>

        {/* Email */}
        <Column fillWidth gap="4">
          <Text 
            variant="label-default-xs" 
            style={{ 
              color: "rgba(255, 255, 255, 0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}
          >
            EMAIL
          </Text>
          <a href={`mailto:${content.email}`} style={{ textDecoration: "none" }}>
            <Text variant="body-default-m" style={{ color: "#3b82f6" }}>
              {content.email || "hello@example.com"}
            </Text>
          </a>
        </Column>

        {/* Divider */}
        <div style={{ width: "100%", height: "1px", background: "rgba(255, 255, 255, 0.1)" }} />

        {/* GitHub */}
        <a href={content.github} style={{ textDecoration: "none", width: "100%" }}>
          <Row 
            fillWidth 
            gap="12" 
            paddingY="12" 
            paddingX="16" 
            radius="l"
            align="center"
            style={{ 
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            className="link-card"
          >
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <FiGithub size={20} color="black" />
            </div>
            <Column gap="2" style={{ flex: 1, minWidth: 0 }} align="start">
              <Text variant="label-default-s" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                GITHUB
              </Text>
              <Text variant="body-default-s" style={{ color: "white" }}>
                @{content.githubUsername || "yourusername"}
              </Text>
            </Column>
            <div style={{ marginLeft: "auto", flexShrink: 0 }}>
              <Text style={{ color: "rgba(255, 255, 255, 0.3)" }}>›</Text>
            </div>
          </Row>
        </a>

        {/* Discord */}
        <DiscordWidget userId={content.discordId || ""} />

        {/* Website */}
        <a href={content.website} style={{ textDecoration: "none", width: "100%" }}>
          <Row 
            fillWidth 
            gap="12" 
            paddingY="12" 
            paddingX="16" 
            radius="l"
            align="center"
            style={{ 
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            className="link-card"
          >
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <FiGlobe size={20} color="white" />
            </div>
            <Column gap="2" style={{ flex: 1, minWidth: 0 }} align="start">
              <Text variant="label-default-s" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                WEBSITE
              </Text>
              <Text variant="body-default-s" style={{ color: "white" }}>
                {content.websiteDisplay || "yourwebsite.com"}
              </Text>
            </Column>
            <div style={{ marginLeft: "auto", flexShrink: 0 }}>
              <Text style={{ color: "rgba(255, 255, 255, 0.3)" }}>›</Text>
            </div>
          </Row>
        </a>

        {/* LinkedIn */}
        <a href={content.linkedin} style={{ textDecoration: "none", width: "100%" }}>
          <Row 
            fillWidth 
            gap="12" 
            paddingY="12" 
            paddingX="16" 
            radius="l"
            align="center"
            style={{ 
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            className="link-card"
          >
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#0077b5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <FiLinkedin size={20} color="white" />
            </div>
            <Column gap="2" style={{ flex: 1, minWidth: 0 }} align="start">
              <Text variant="label-default-s" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                LINKEDIN
              </Text>
              <Text variant="body-default-s" style={{ color: "white" }}>
                {content.linkedinDisplay || "linkedin.com/in/you"}
              </Text>
            </Column>
            <div style={{ marginLeft: "auto", flexShrink: 0 }}>
              <Text style={{ color: "rgba(255, 255, 255, 0.3)" }}>›</Text>
            </div>
          </Row>
        </a>

        {/* Skills Section */}
        <Column fillWidth gap="16" paddingTop="16">
          {/* Languages */}
          <Column fillWidth gap="8">
            <Text 
              variant="label-default-xs" 
              style={{ 
                color: "rgba(255, 255, 255, 0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            >
              LANGUAGES
            </Text>
            <Row fillWidth gap="8" wrap>
              {["CSS", "HTML", "JavaScript", "Python", "Java", "C#", "PowerShell"].map((skill) => (
                <div
                  key={skill}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Text variant="body-default-s" style={{ color: "white" }}>
                    {skill}
                  </Text>
                </div>
              ))}
            </Row>
          </Column>

          {/* Frontend */}
          <Column fillWidth gap="8">
            <Text 
              variant="label-default-xs" 
              style={{ 
                color: "rgba(255, 255, 255, 0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            >
              FRONTEND
            </Text>
            <Row fillWidth gap="8" wrap>
              {["React", "Next.js"].map((skill) => (
                <div
                  key={skill}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Text variant="body-default-s" style={{ color: "white" }}>
                    {skill}
                  </Text>
                </div>
              ))}
            </Row>
          </Column>

          {/* Backend */}
          <Column fillWidth gap="8">
            <Text 
              variant="label-default-xs" 
              style={{ 
                color: "rgba(255, 255, 255, 0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            >
              BACKEND
            </Text>
            <Row fillWidth gap="8" wrap>
              {["Node.js", "REST APIs", "Discord.js"].map((skill) => (
                <div
                  key={skill}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Text variant="body-default-s" style={{ color: "white" }}>
                    {skill}
                  </Text>
                </div>
              ))}
            </Row>
          </Column>

          {/* Databases */}
          <Column fillWidth gap="8">
            <Text 
              variant="label-default-xs" 
              style={{ 
                color: "rgba(255, 255, 255, 0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            >
              DATABASES
            </Text>
            <Row fillWidth gap="8" wrap>
              {["SQL", "Supabase", "Firebase"].map((skill) => (
                <div
                  key={skill}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Text variant="body-default-s" style={{ color: "white" }}>
                    {skill}
                  </Text>
                </div>
              ))}
            </Row>
          </Column>

          {/* DevOps & Tools */}
          <Column fillWidth gap="8">
            <Text 
              variant="label-default-xs" 
              style={{ 
                color: "rgba(255, 255, 255, 0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            >
              DEVOPS & TOOLS
            </Text>
            <Row fillWidth gap="8" wrap>
              {["Git/GitHub", "SCCM", "Active Directory", "ServiceNow"].map((skill) => (
                <div
                  key={skill}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Text variant="body-default-s" style={{ color: "white" }}>
                    {skill}
                  </Text>
                </div>
              ))}
            </Row>
          </Column>
        </Column>

        {/* Action Buttons */}
        <Row fillWidth gap="12" paddingTop="24">
          <button
            onClick={handleSaveContact}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            className="contact-button"
          >
            <FiDownload size={18} color="white" />
            <Text variant="body-default-m" style={{ color: "white", fontWeight: 500 }}>
              Save Contact
            </Text>
          </button>

          <button
            onClick={handleShareContact}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            className="contact-button"
          >
            <FiShare2 size={18} color="white" />
            <Text variant="body-default-m" style={{ color: "white", fontWeight: 500 }}>
              Share Contact
            </Text>
          </button>
        </Row>
      </Column>
    </Column>
    </>
  );
}
