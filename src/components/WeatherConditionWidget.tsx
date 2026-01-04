"use client";

import { useEffect, useState } from "react";
import { Column, Text } from "@once-ui-system/core";
import { FiSun, FiCloud, FiCloudRain, FiCloudSnow, FiCloudDrizzle } from "react-icons/fi";
import { WiThunderstorm, WiFog } from "react-icons/wi";

export default function WeatherConditionWidget() {
  const [condition, setCondition] = useState<{
    text: string;
    weatherCode: number;
  } | null>(null);

  useEffect(() => {
    const handleWeatherUpdate = (event: CustomEvent) => {
      const { weatherCode } = event.detail;
      setCondition({
        text: getWeatherCondition(weatherCode),
        weatherCode: weatherCode,
      });
    };

    window.addEventListener('weatherUpdate' as any, handleWeatherUpdate);

    return () => {
      window.removeEventListener('weatherUpdate' as any, handleWeatherUpdate);
    };
  }, []);

  const getWeatherCondition = (code: number): string => {
    if (code === 0) return "Clear";
    if (code <= 3) return "Cloudy";
    if (code <= 49) return "Foggy";
    if (code <= 59) return "Drizzle";
    if (code <= 69) return "Rain";
    if (code <= 79) return "Snow";
    if (code <= 84) return "Showers";
    if (code <= 99) return "Thunderstorm";
    return "Clear";
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <FiSun size={32} color="white" />;
    if (code <= 3) return <FiCloud size={32} color="white" />;
    if (code <= 49) return <WiFog size={40} color="white" />;
    if (code <= 59) return <FiCloudDrizzle size={32} color="white" />;
    if (code <= 69) return <FiCloudRain size={32} color="white" />;
    if (code <= 79) return <FiCloudSnow size={32} color="white" />;
    if (code <= 84) return <FiCloudRain size={32} color="white" />;
    if (code <= 99) return <WiThunderstorm size={40} color="white" />;
    return <FiSun size={32} color="white" />;
  };

  if (!condition) {
    return (
      <Column
        gap="4"
        padding="12"
        radius="l"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          minWidth: "90px",
          alignItems: "center",
        }}
      >
        <div style={{ height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Text variant="heading-strong-l" style={{ color: "white" }}>--</Text>
        </div>
      </Column>
    );
  }

  return (
    <Column
      gap="8"
      padding="12"
      radius="l"
      style={{
        background: "rgba(255, 255, 255, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        minWidth: "90px",
        alignItems: "center",
      }}
    >
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
      }}>
        {getWeatherIcon(condition.weatherCode)}
      </div>
      <Text 
        variant="label-default-xs" 
        style={{ 
          color: "rgba(255, 255, 255, 0.9)",
          fontSize: "11px"
        }}
      >
        {condition.text.toUpperCase()}
      </Text>
    </Column>
  );
}
