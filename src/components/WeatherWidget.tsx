"use client";

import React, { useState, useEffect } from "react";
import { Column, Text } from "@once-ui-system/core";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<{
    temp: number;
    low: number;
    high: number;
  } | null>(null);

  useEffect(() => {
    // Fetch weather for Bloomington-Normal, IL
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=40.4842&longitude=-88.9937&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America/Chicago&forecast_days=1`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          low: Math.round(data.daily.temperature_2m_min[0]),
          high: Math.round(data.daily.temperature_2m_max[0]),
        });
      })
      .catch((err) => {
        console.error("Weather fetch error:", err);
        // Fallback to default values
        setWeather({ temp: 67, low: 50, high: 78 });
      });
  }, []);

  if (!weather) {
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
        <Text variant="heading-strong-l" style={{ color: "white" }}>
          --°
        </Text>
      </Column>
    );
  }

  // Calculate the position of the current temp on the arc (0-180 degrees)
  const tempRange = weather.high - weather.low;
  const tempPosition = weather.temp - weather.low;
  const percentage = tempRange > 0 ? (tempPosition / tempRange) * 100 : 50;
  const angle = (percentage / 100) * 180; // 0 to 180 degrees

  return (
    <Column
      gap="6"
      padding="12"
      radius="l"
      style={{
        background: "rgba(255, 255, 255, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        minWidth: "90px",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Arc/Gauge Container */}
      <div
        style={{
          position: "relative",
          width: "60px",
          height: "35px",
          marginBottom: "4px",
        }}
      >
        {/* Background Arc */}
        <svg
          width="60"
          height="35"
          viewBox="0 0 60 35"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <path
            d="M 5 30 A 25 25 0 0 1 55 30"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        {/* Active Arc (from low to current temp) */}
        <svg
          width="60"
          height="35"
          viewBox="0 0 60 35"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <path
            d="M 5 30 A 25 25 0 0 1 55 30"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 78.5} 78.5`}
          />
        </svg>

        {/* Current Temperature Indicator Dot */}
        <div
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 0 4px rgba(255, 255, 255, 0.8)",
            left: `${5 + 25 + 25 * Math.cos((Math.PI * (180 - angle)) / 180)}px`,
            top: `${30 - 25 * Math.sin((Math.PI * (180 - angle)) / 180)}px`,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Current Temperature */}
        <Text
          variant="heading-strong-l"
          style={{
            color: "white",
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "20px",
          }}
        >
          {weather.temp}°
        </Text>
      </div>

      {/* Low and High */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          paddingTop: "4px",
        }}
      >
        <Text
          variant="label-default-xs"
          style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.7)" }}
        >
          {weather.low}
        </Text>
        <Text
          variant="label-default-xs"
          style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.7)" }}
        >
          {weather.high}
        </Text>
      </div>
    </Column>
  );
}
