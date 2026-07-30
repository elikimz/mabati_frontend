import { useEffect, useState } from "react";

const ServiceUnavailable: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after mount
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "24px",
        boxSizing: "border-box",
        transition: "opacity 0.8s ease-in",
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        style={{
          maxWidth: "640px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Illustration */}
        <div
          style={{
            width: "220px",
            height: "220px",
            margin: "0 auto 32px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1s ease-in 0.1s, transform 1s ease-out 0.1s",
          }}
        >
          <img
            src="/unavailable-illustration.png"
            alt="Service unavailable"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Heading with warning icon */}
        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 32px)",
            fontWeight: 700,
            color: "#f8fafc",
            margin: "0 0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "28px",
              color: "#f59e0b",
            }}
          >
            &#x26A0;
          </span>
          Service Unavailable
        </h1>

        {/* Divider */}
        <div
          style={{
            width: "60px",
            height: "3px",
            backgroundColor: "#f59e0b",
            margin: "0 auto 20px",
            borderRadius: "2px",
          }}
        />

        {/* Description */}
        <p
          style={{
            fontSize: "clamp(14px, 2vw, 16px)",
            color: "#94a3b8",
            lineHeight: 1.7,
            margin: "0 0 28px",
            maxWidth: "480px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          This website is currently unavailable due to an administrative
          disagreement.
        </p>

        <p
          style={{
            fontSize: "clamp(13px, 1.8vw, 14px)",
            color: "#cbd5e1",
            lineHeight: 1.6,
            margin: "0 0 32px",
          }}
        >
          If you are the website owner or require assistance, please contact the
          administrator.
        </p>

        {/* Contact Administrator */}
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#f59e0b",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            Contact Administrator
          </span>
          <a
            href="tel:+254743895949"
            style={{
              fontSize: "clamp(18px, 3vw, 22px)",
              fontWeight: 700,
              color: "#f8fafc",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 24px",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "12px",
              backgroundColor: "rgba(245, 158, 11, 0.08)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(245, 158, 11, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(245, 158, 11, 0.08)";
            }}
          >
            <span style={{ fontSize: "20px" }}>&#x1F4DE;</span>
            0743 895 949
          </a>
        </div>

        {/* Thank you note */}
        <p
          style={{
            fontSize: "13px",
            color: "#64748b",
            margin: "40px 0 0",
          }}
        >
          Thank you for your understanding.
        </p>
      </div>
    </div>
  );
};

export default ServiceUnavailable;
