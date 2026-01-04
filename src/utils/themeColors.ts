export const getThemeColors = (theme: "light" | "dark") => ({
  text: {
    primary: theme === "dark" ? "white" : "black",
    secondary: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
    tertiary: theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
    link: theme === "dark" ? "#3b82f6" : "#2563eb",
  },
  background: {
    card: theme === "dark" ? "rgba(28, 28, 30, 0.65)" : "rgba(255, 255, 255, 0.65)",
    page: theme === "dark" ? "#0a0a0a" : "#f5f5f7",
    widget: theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)",
    linkCard: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    linkCardHover: theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
  },
  border: {
    card: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    widget: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
    divider: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    avatar: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
  },
  gradient: {
    avatarBg: theme === "dark" 
      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))"
      : "linear-gradient(135deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.02))",
  },
});
