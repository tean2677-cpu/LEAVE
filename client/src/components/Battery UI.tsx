import { useFlashlight } from "@/lib/stores/useBedroomGame";
export function BatteryUI() {
  const { hasFlashlight, battery } = useFlashlight();
  
  // Only show if player has the flashlight
  if (!hasFlashlight) return null;
  
  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 1000,
      fontFamily: "Inter, sans-serif"
    }}>
      {/* Battery container */}
      <div style={{
        background: "rgba(0, 0, 0, 0.8)",
        padding: "12px 16px",
        borderRadius: "8px",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        minWidth: "200px"
      }}>
        {/* Battery label */}
        <div style={{
          color: "#fff",
          fontSize: "12px",
          marginBottom: "8px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          Flashlight Battery
        </div>
        
        {/* Battery bar background */}
        <div style={{
          width: "100%",
          height: "24px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "4px",
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          {/* Battery bar fill - drains from right to left */}
          <div style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: `${battery}%`,
            background: battery > 50 
              ? "linear-gradient(90deg, #ffd700, #ffed4e)" 
              : battery > 20 
                ? "linear-gradient(90deg, #ff8c00, #ffd700)"
                : "linear-gradient(90deg, #ff4444, #ff8c00)",
            transition: "width 0.3s ease-out, background 0.3s ease-out",
            boxShadow: battery > 0 ? "0 0 10px rgba(255, 215, 0, 0.5)" : "none"
          }} />
          
          {/* Battery percentage text */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontSize: "12px",
            fontWeight: "700",
            textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
            zIndex: 2
          }}>
            {battery}%
          </div>
        </div>
        
        {/* Low battery warning */}
        {battery <= 20 && battery > 0 && (
          <div style={{
            color: "#ff4444",
            fontSize: "11px",
            marginTop: "6px",
            fontWeight: "600",
            textAlign: "center"
          }}>
            ⚠ Low Battery
          </div>
        )}
        
        {/* Battery depleted message */}
        {battery === 0 && (
          <div style={{
            color: "#ff4444",
            fontSize: "11px",
            marginTop: "6px",
            fontWeight: "600",
            textAlign: "center"
          }}>
            Battery Depleted
          </div>
        )}
      </div>
    </div>
  );
}
