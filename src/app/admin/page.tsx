"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Column, Heading, Text } from "@once-ui-system/core";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (status === "unauthenticated") {
      router.push('/');
    }
    
    if (status === "authenticated" && session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <Column
        fillWidth
        fillHeight
        horizontal="center"
        vertical="center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        }}
      >
        <Text style={{ color: "white" }}>Loading...</Text>
      </Column>
    );
  }

  if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return null;
  }

  return (
    <Column
      fillWidth
      fillHeight
      horizontal="center"
      vertical="center"
      padding="32"
      gap="24"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
      }}
    >
      <Column
        gap="16"
        padding="32"
        radius="xl"
        style={{
          maxWidth: "800px",
          width: "100%",
          background: "rgba(28, 28, 30, 0.8)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Heading variant="heading-strong-xl" style={{ color: "white" }}>
          Admin Dashboard
        </Heading>
        <Text style={{ color: "rgba(255, 255, 255, 0.7)" }}>
          Welcome back, {session.user.name || session.user.email}!
        </Text>
        <Text style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>
          Dashboard features coming soon...
        </Text>
      </Column>
    </Column>
  );
}
