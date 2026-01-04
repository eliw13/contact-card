"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Column, Heading, Text, Row } from "@once-ui-system/core";
import { 
  FiActivity, 
  FiGithub, 
  FiCloud, 
  FiCalendar, 
  FiEdit3,
  FiEye,
  FiMessageSquare 
} from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import CustomCursor from "@/components/CustomCursor";
import { useEffect as useReactEffect, useRef } from "react";

interface ServiceStatus {
  status: 'operational' | 'degraded' | 'down';
  lastChecked: Date;
  responseTime?: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pageViews, setPageViews] = useState(0);
  const [showChartModal, setShowChartModal] = useState(false);
  const [monthlyData, setMonthlyData] = useState<{ month: string; views: number }[]>([]);
  const [discordStatus, setDiscordStatus] = useState<ServiceStatus>({ 
    status: 'operational', 
    lastChecked: new Date() 
  });
  const [githubStatus, setGithubStatus] = useState<ServiceStatus>({ 
    status: 'operational', 
    lastChecked: new Date() 
  });
  const [weatherStatus, setWeatherStatus] = useState<ServiceStatus>({ 
    status: 'operational', 
    lastChecked: new Date() 
  });

  useEffect(() => {
    // Allow access on localhost without authentication
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
      // Skip authentication check on localhost
      return;
    }

    // Redirect if not authenticated or not admin (production only)
    if (status === "unauthenticated") {
      router.push('/');
    }
    
    if (status === "authenticated" && session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    // Fetch page views from localStorage (simple implementation)
    const views = localStorage.getItem('pageViews');
    setPageViews(views ? parseInt(views) : 0);

    // Load monthly data
    const storedMonthlyData = localStorage.getItem('monthlyPageViews');
    if (storedMonthlyData) {
      const data = JSON.parse(storedMonthlyData);
      // Filter to only show data from current year onwards
      const currentYear = new Date().getFullYear();
      const filteredData = data.filter((item: { month: string; views: number }) => {
        const itemYear = parseInt(item.month.split(' ')[1]);
        return itemYear >= currentYear;
      });
      setMonthlyData(filteredData);
    } else {
      // Initialize with data from January of current year onwards
      const months = [];
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 0-11
      
      // Start from January of current year
      for (let i = 0; i <= currentMonth; i++) {
        const date = new Date(currentYear, i, 1);
        months.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          views: 0
        });
      }
      setMonthlyData(months);
      localStorage.setItem('monthlyPageViews', JSON.stringify(months));
    }

    // Check service statuses
    checkDiscordStatus();
    checkGithubStatus();
    checkWeatherStatus();

    // Refresh status every 60 seconds
    const interval = setInterval(() => {
      checkDiscordStatus();
      checkGithubStatus();
      checkWeatherStatus();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Render chart when modal opens
  useEffect(() => {
    if (showChartModal && monthlyData.length > 0 && typeof window !== 'undefined') {
      const renderChart = async () => {
        const Chart = (await import('chart.js/auto')).default;
        const canvas = document.getElementById('pageViewsChart') as HTMLCanvasElement;
        
        if (!canvas) return;

        // Destroy existing chart if it exists
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
          existingChart.destroy();
        }

        new Chart(canvas, {
          type: 'line',
          data: {
            labels: monthlyData.map(d => d.month),
            datasets: [{
              label: 'Page Views',
              data: monthlyData.map(d => d.views),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 5,
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointHoverRadius: 7,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)',
                  precision: 0
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              },
              x: {
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)'
                },
                grid: {
                  display: false
                }
              }
            }
          }
        });
      };

      renderChart();
    }
  }, [showChartModal, monthlyData]);

  const checkDiscordStatus = async () => {
    const startTime = Date.now();
    try {
      // Check Lanyard API (same as contact card)
      const response = await fetch('https://api.lanyard.rest/v1/users/603480911014789121');
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        setDiscordStatus({ 
          status: responseTime > 1000 ? 'degraded' : 'operational', 
          lastChecked: new Date(),
          responseTime 
        });
      } else {
        setDiscordStatus({ status: 'down', lastChecked: new Date() });
      }
    } catch (error) {
      setDiscordStatus({ status: 'down', lastChecked: new Date() });
    }
  };

  const checkGithubStatus = async () => {
    const startTime = Date.now();
    try {
      const response = await fetch('https://api.github.com/users/eliw13');
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        setGithubStatus({ 
          status: responseTime > 1000 ? 'degraded' : 'operational', 
          lastChecked: new Date(),
          responseTime 
        });
      } else {
        setGithubStatus({ status: 'down', lastChecked: new Date() });
      }
    } catch (error) {
      setGithubStatus({ status: 'down', lastChecked: new Date() });
    }
  };

  const checkWeatherStatus = async () => {
    const startTime = Date.now();
    try {
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=40.4842&longitude=-88.9937&current=temperature_2m&temperature_unit=fahrenheit'
      );
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        setWeatherStatus({ 
          status: responseTime > 2000 ? 'degraded' : 'operational', 
          lastChecked: new Date(),
          responseTime 
        });
      } else {
        setWeatherStatus({ status: 'down', lastChecked: new Date() });
      }
    } catch (error) {
      setWeatherStatus({ status: 'down', lastChecked: new Date() });
    }
  };

  const getStatusColor = (status: 'operational' | 'degraded' | 'down') => {
    switch (status) {
      case 'operational': return '#10b981'; // green
      case 'degraded': return '#f59e0b'; // yellow
      case 'down': return '#ef4444'; // red
    }
  };

  const getStatusText = (status: 'operational' | 'degraded' | 'down') => {
    switch (status) {
      case 'operational': return 'Operational';
      case 'degraded': return 'Degraded';
      case 'down': return 'Down';
    }
  };

  if (status === "loading") {
    // Skip loading screen on localhost
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
    if (isLocalhost) {
      // Continue to render on localhost
    } else {
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
  }

  // Allow access on localhost
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (!isLocalhost && (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)) {
    return null;
  }

  return (
    <>
      <CustomCursor />
      <Column
      fillWidth
      fillHeight
      padding="32"
      gap="32"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
      }}
      suppressHydrationWarning
    >
      {/* Header */}
      <Column gap="8" style={{ maxWidth: "1400px", width: "100%", margin: "0 auto" }}>
        <Heading variant="heading-strong-xl" style={{ color: "white" }}>
          Admin Dashboard
        </Heading>
        <Text style={{ color: "rgba(255, 255, 255, 0.7)" }}>
          Welcome back{session?.user?.name ? `, ${session.user.name}` : session?.user?.email ? `, ${session.user.email}` : ''}!
        </Text>
      </Column>

      {/* Bento Grid */}
      <div className="bento-grid" style={{ maxWidth: "1400px", width: "100%", margin: "0 auto" }}>
        
        {/* Discord Status */}
        <div className="bento-card">
          <div className="bento-card-content">
            <Row fillWidth horizontal="between" align="center">
              <SiDiscord size={28} color="#5865F2" />
              <div className="status-indicator" style={{ 
                backgroundColor: getStatusColor(discordStatus.status)
              }} />
            </Row>
            <Heading variant="heading-strong-m" style={{ color: "white", marginTop: "16px" }}>
              Discord Integration
            </Heading>
            <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
              {getStatusText(discordStatus.status)}
            </Text>
            {discordStatus.responseTime && (
              <Text style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px", marginTop: "8px" }}>
                Response time: {discordStatus.responseTime}ms
              </Text>
            )}
          </div>
        </div>

        {/* GitHub Status */}
        <div className="bento-card">
          <div className="bento-card-content">
            <Row fillWidth horizontal="between" align="center">
              <FiGithub size={28} color="white" />
              <div className="status-indicator" style={{ 
                backgroundColor: getStatusColor(githubStatus.status)
              }} />
            </Row>
            <Heading variant="heading-strong-m" style={{ color: "white", marginTop: "16px" }}>
              GitHub Integration
            </Heading>
            <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
              {getStatusText(githubStatus.status)}
            </Text>
            {githubStatus.responseTime && (
              <Text style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px", marginTop: "8px" }}>
                Response time: {githubStatus.responseTime}ms
              </Text>
            )}
          </div>
        </div>

        {/* Weather & Date Status */}
        <div className="bento-card">
          <div className="bento-card-content">
            <Row fillWidth horizontal="between" align="center">
              <FiCloud size={28} color="#60a5fa" />
              <div className="status-indicator" style={{ 
                backgroundColor: getStatusColor(weatherStatus.status)
              }} />
            </Row>
            <Heading variant="heading-strong-m" style={{ color: "white", marginTop: "16px" }}>
              Weather Widget
            </Heading>
            <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
              {getStatusText(weatherStatus.status)}
            </Text>
            {weatherStatus.responseTime && (
              <Text style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px", marginTop: "8px" }}>
                Response time: {weatherStatus.responseTime}ms
              </Text>
            )}
          </div>
        </div>

        {/* Date Widget Status */}
        <div className="bento-card">
          <div className="bento-card-content">
            <Row fillWidth horizontal="between" align="center">
              <FiCalendar size={28} color="#a78bfa" />
              <div className="status-indicator" style={{ 
                backgroundColor: '#10b981' // Always operational (client-side)
              }} />
            </Row>
            <Heading variant="heading-strong-m" style={{ color: "white", marginTop: "16px" }}>
              Date Widget
            </Heading>
            <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
              Operational
            </Text>
            <Text style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px", marginTop: "8px" }}>
              Client-side only
            </Text>
          </div>
        </div>

        {/* Page Views Card - Medium */}
        <div 
          className="bento-card" 
          onClick={() => setShowChartModal(true)}
          style={{ cursor: 'pointer' }}
        >
          <div className="bento-card-content">
            <FiEye size={24} color="#3b82f6" />
            <Heading variant="heading-strong-l" style={{ color: "white", marginTop: "12px" }}>
              {pageViews.toLocaleString()}
            </Heading>
            <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>Page Views</Text>
            <Text style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px", marginTop: "8px" }}>
              Click to view chart
            </Text>
          </div>
        </div>

        {/* Edit Site Content */}
        <div className="bento-card bento-card-wide">
          <div className="bento-card-content">
            <FiEdit3 size={28} color="#f59e0b" />
            <Heading variant="heading-strong-m" style={{ color: "white", marginTop: "16px" }}>
              Edit Site Content
            </Heading>
            <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", marginBottom: "16px" }}>
              Update contact information, links, and content
            </Text>
            <button 
              onClick={() => router.push('/admin/edit')}
              className="bento-button"
            >
              Open Editor
            </button>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="bento-card">
          <div className="bento-card-content">
            <FiActivity size={28} color="#ec4899" />
            <Heading variant="heading-strong-m" style={{ color: "white", marginTop: "16px", marginBottom: "16px" }}>
              System Overview
            </Heading>
            
            <Column gap="12" fillWidth>
              <Row fillWidth horizontal="between" align="center">
                <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
                  Operational
                </Text>
                <Text style={{ color: "#10b981", fontWeight: 600 }}>
                  {[discordStatus, githubStatus, weatherStatus].filter(s => s.status === 'operational').length + 1}
                </Text>
              </Row>
              
              <Row fillWidth horizontal="space-between" align="center">
                <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
                  Degraded
                </Text>
                <Text style={{ color: "#f59e0b", fontWeight: 600 }}>
                  {[discordStatus, githubStatus, weatherStatus].filter(s => s.status === 'degraded').length}
                </Text>
              </Row>
              
              <Row fillWidth horizontal="space-between" align="center">
                <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
                  Down
                </Text>
                <Text style={{ color: "#ef4444", fontWeight: 600 }}>
                  {[discordStatus, githubStatus, weatherStatus].filter(s => s.status === 'down').length}
                </Text>
              </Row>
            </Column>

            <div style={{ marginTop: "16px" }}>
              <Text style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px" }}>
                Last updated: {new Date().toLocaleTimeString()}
              </Text>
            </div>
          </div>
        </div>

      </div>
    </Column>

    {/* Chart Modal */}
    {typeof window !== 'undefined' && showChartModal && (
      <div 
        className="modal-overlay" 
        onClick={() => setShowChartModal(false)}
        style={{ zIndex: 3000 }}
      >
        <div 
          className="modal-content" 
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '800px', width: '90%', padding: '32px' }}
        >
          <Row fillWidth horizontal="between" align="center" style={{ marginBottom: '24px' }}>
            <Heading variant="heading-strong-l" style={{ color: "white" }}>
              Monthly Page Views
            </Heading>
            <button
              onClick={() => setShowChartModal(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              ×
            </button>
          </Row>

          <div style={{ width: '100%', height: '300px', marginBottom: '24px' }}>
            <canvas id="pageViewsChart"></canvas>
          </div>

          <Row fillWidth horizontal="center" gap="12">
            <button
              onClick={() => {
                if (confirm('Reset all page view data? This cannot be undone.')) {
                  localStorage.setItem('pageViews', '0');
                  setPageViews(0);
                  
                  // Reset monthly data - start from January of current year
                  const months = [];
                  const now = new Date();
                  const currentYear = now.getFullYear();
                  const currentMonth = now.getMonth(); // 0-11
                  
                  for (let i = 0; i <= currentMonth; i++) {
                    const date = new Date(currentYear, i, 1);
                    months.push({
                      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                      views: 0
                    });
                  }
                  setMonthlyData(months);
                  localStorage.setItem('monthlyPageViews', JSON.stringify(months));
                  setShowChartModal(false);
                }
              }}
              className="bento-button"
              style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              Reset All Data
            </button>
            <button
              onClick={() => setShowChartModal(false)}
              className="modal-close"
              style={{ width: 'auto', padding: '10px 20px' }}
            >
              Close
            </button>
          </Row>
        </div>
      </div>
    )}
    </>
  );
}
