"use client";

import React, { useState, useEffect } from "react";
import { Row, Column, Text } from "@once-ui-system/core";
import { SiDiscord } from "react-icons/si";

interface DiscordActivity {
  name: string;
  type: number;
  state?: string;
  details?: string;
}

interface DiscordStatus {
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: DiscordActivity[];
}

export default function DiscordWidget({ userId }: { userId: string }) {
  const [status, setStatus] = useState<DiscordStatus | null>(null);

  useEffect(() => {
    if (!userId || userId === "YOUR_DISCORD_USER_ID") {
      console.log("No valid Discord user ID provided");
      return;
    }

    let ws: WebSocket | null = null;
    let heartbeatInterval: NodeJS.Timeout | null = null;

    const connect = () => {
      ws = new WebSocket("wss://api.lanyard.rest/socket");

      ws.onopen = () => {
        console.log("Lanyard WebSocket connected");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.op) {
          case 1: // Hello - start heartbeat
            heartbeatInterval = setInterval(() => {
              if (ws?.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ op: 3 })); // Heartbeat
              }
            }, data.d.heartbeat_interval);

            // Subscribe to user
            ws?.send(
              JSON.stringify({
                op: 2,
                d: {
                  subscribe_to_id: userId,
                },
              })
            );
            break;

          case 0: // Event - initial data or update
            if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
              setStatus(data.d);
            }
            break;
        }
      };

      ws.onerror = (error) => {
        console.error("Lanyard WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("Lanyard WebSocket disconnected, reconnecting...");
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        // Reconnect after 5 seconds
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (ws) {
        ws.close();
        ws = null;
      }
    };
  }, [userId]);

  const getStatusColor = (discordStatus: string) => {
    switch (discordStatus) {
      case "online":
        return "#3ba55c";
      case "idle":
        return "#faa61a";
      case "dnd":
        return "#ed4245";
      case "offline":
        return "#747f8d";
      default:
        return "#747f8d";
    }
  };

  const getStatusText = () => {
    if (!status) return "Loading...";

    // If idle, always show "Idle" regardless of activities
    if (status.discord_status === "idle") {
      return "Idle";
    }

    // Find the most relevant activity
    const activity = status.activities.find(
      (act) => act.type === 0 || act.type === 2 || act.type === 4
    );

    if (activity) {
      // Type 0 = Playing/Gaming
      if (activity.type === 0) {
        if (activity.name === "Visual Studio Code") {
          return activity.details || "Coding in VS Code";
        }
        return `Playing ${activity.name}`;
      }
      
      // Type 2 = Listening (Spotify)
      if (activity.type === 2) {
        return `Listening to ${activity.details || activity.name}`;
      }
      
      // Type 4 = Custom status
      if (activity.type === 4) {
        return activity.state || activity.name;
      }
      
      return activity.name;
    }

    // Map status to readable text
    switch (status.discord_status) {
      case "online":
        return "Online";
      case "dnd":
        return "Do Not Disturb";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <div style={{ width: "100%" }}>
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
          transition: "all 0.2s ease",
        }}
        className="link-card"
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#5865F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            flexShrink: 0
          }}
        >
          <SiDiscord size={20} color="white" />
          <div
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: status ? getStatusColor(status.discord_status) : "#747f8d",
              border: "2px solid rgba(28, 28, 30, 0.7)",
            }}
          />
        </div>
        <Column gap="2" style={{ flex: 1, minWidth: 0 }} align="start">
          <Text
            variant="label-default-s"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            DISCORD
          </Text>
          <Text variant="body-default-s" style={{ color: "white" }}>
            {getStatusText()}
          </Text>
        </Column>
        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
          <Text style={{ color: "rgba(255, 255, 255, 0.3)" }}>›</Text>
        </div>
      </Row>
    </div>
  );
}
