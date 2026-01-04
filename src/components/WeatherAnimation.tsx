"use client";

export default function WeatherAnimation() {
  // For now, always show clouds for testing
  return (
    <div className="weather-animation-overlay">
      <div className="clouds-container">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="cloud"
            style={{
              top: `${10 + i * 12}%`,
              left: `${(i * 25) % 100}%`,
              animationDelay: `${i * -5}s`,
              animationDuration: `${25 + i * 2}s`,
            }}
          >
            <div className="cloud-part cloud-part-1"></div>
            <div className="cloud-part cloud-part-2"></div>
            <div className="cloud-part cloud-part-3"></div>
            <div className="cloud-part cloud-part-4"></div>
            <div className="cloud-part cloud-part-5"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
