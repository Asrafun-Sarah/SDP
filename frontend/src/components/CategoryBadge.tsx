import React from "react";
import { Cpu, Bot, Code, Wrench, Brain, Zap } from "lucide-react";

interface CategoryBadgeProps {
  category: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getBadgeStyle = () => {
    switch (category) {
      case "Embedded Systems":
        return {
          bg: "rgba(56, 189, 248, 0.12)",
          color: "#38bdf8",
          border: "rgba(56, 189, 248, 0.3)",
          icon: Cpu,
        };
      case "Robotics":
        return {
          bg: "rgba(168, 85, 247, 0.12)",
          color: "#c084fc",
          border: "rgba(168, 85, 247, 0.3)",
          icon: Bot,
        };
      case "Software":
        return {
          bg: "rgba(52, 211, 153, 0.12)",
          color: "#34d399",
          border: "rgba(52, 211, 153, 0.3)",
          icon: Code,
        };
      case "Mechanical/CAD":
        return {
          bg: "rgba(251, 191, 36, 0.12)",
          color: "#fbbf24",
          border: "rgba(251, 191, 36, 0.3)",
          icon: Wrench,
        };
      case "ML/AI":
        return {
          bg: "rgba(244, 63, 94, 0.12)",
          color: "#fb7185",
          border: "rgba(244, 63, 94, 0.3)",
          icon: Brain,
        };
      default:
        return {
          bg: "rgba(129, 140, 248, 0.12)",
          color: "#818cf8",
          border: "rgba(129, 140, 248, 0.3)",
          icon: Zap,
        };
    }
  };

  const style = getBadgeStyle();
  const IconComponent = style.icon;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        padding: "0.25rem 0.625rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      <IconComponent size={13} />
      {category}
    </span>
  );
};
