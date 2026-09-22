import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CancelIcon from "@mui/icons-material/Cancel";
import "../styles/GCCApprovalRequests.css";

const cards = [
  { key: "total", label: "Total Requests", icon: AssignmentIcon, tone: "blue" },
  { key: "pending", label: "Pending GCC Approval", icon: HourglassTopIcon, tone: "yellow" },
  { key: "approved", label: "Approved", icon: CheckCircleIcon, tone: "green" },
  { key: "rejected", label: "Rejected", icon: CancelIcon, tone: "red" },
  { key: "budget", label: "Total Budget (INR)", icon: AccountBalanceWalletIcon, tone: "orange" },
];

function formatBudget(value) {
  if (value >= 1000) return `₹${Math.round(value / 1000)}K`;
  return `₹${value}`;
}

function KPICards({ metrics }) {
  return (
    <div className="gcc-kpi-grid">
      {cards.map(({ key, label, icon: Icon, tone }) => {
        const value = key === "budget" ? formatBudget(metrics.budget) : metrics[key];
        const subText = key === "budget" ? `₹${metrics.budget.toLocaleString("en-IN")}` : "";

        return (
          <div className={`gcc-kpi-card gcc-kpi-${tone}`} key={key}>
            <div className="gcc-kpi-icon"><Icon /></div>
            <div>
              <p>{label}</p>
              <strong>{value}</strong>
              {subText && <small>{subText}</small>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KPICards;
