import { useState, useEffect, useRef } from "react";
import axios from "axios";
import LoggedInNavbar from "../../components/LoggedInNavbar";
import CustomerSidebar from "../../components/CustomerSidebar";
import defaultAvatar from "../../assets/avatar1.jpg";
import "../../styles/customer/Settings.css";

export default function Settings() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  
  const [notifications, setNotifications] = useState({
    projectUpdates: true,
    newAssetReleases: true,
    marketplaceSales: false,
  });

  const avatarInputRef = useRef(null);
  const [avatarTouched, setAvatarTouched] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const user = response.data.user;
          setFullName(user.name || "");
          setEmail(user.email || "");
          setAvatar(user.avatar || defaultAvatar);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem("userNotifications");
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    fetchUserData();
  }, []);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAvatarUpload = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = (event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      input.value = "";
    };
    reader.readAsDataURL(file);
    setAvatarTouched(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");

      // Validate passwords if changing password
      if (newPassword) {
        if (!currentPassword) {
          setMessageType("error");
          setMessage("Current password is required to change password");
          setLoading(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setMessageType("error");
          setMessage("New passwords do not match");
          setLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          setMessageType("error");
          setMessage("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        {
          name: fullName,
          avatar,
          ...(newPassword && { currentPassword, newPassword }),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const updatedUser =
          response.data.user || JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setFullName(updatedUser.name || "");
        setEmail(updatedUser.email || "");
        setAvatar(updatedUser.avatar || "https://i.pravatar.cc/90?img=12");

        // Save notifications to localStorage
        localStorage.setItem("userNotifications", JSON.stringify(notifications));

        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        const successParts = [];
        if (avatarTouched) successParts.push("Profile picture updated");
        if (newPassword) successParts.push("Password changed");
        const successMessage = successParts.length
          ? successParts.join(" and ")
          : "Profile updated successfully!";

        setMessageType("success");
        setMessage(successMessage);
        setTimeout(() => setMessage(""), 3000);
        setAvatarTouched(false);
        if (avatarInputRef.current) {
          avatarInputRef.current.value = "";
        }

        window.dispatchEvent(new CustomEvent("profileUpdated", { detail: updatedUser }));
      }
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setFullName(user.name || "");
    setEmail(user.email || "");
    setAvatar(user.avatar || "https://i.pravatar.cc/90?img=12");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    const savedNotificationsDiscard = localStorage.getItem("userNotifications");
    if (savedNotificationsDiscard) {
      setNotifications(JSON.parse(savedNotificationsDiscard));
    }
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
    setAvatarTouched(false);
  };

  return (
    <>
      <LoggedInNavbar userRole="customer" />
      <div className="set-wrapper">
      <CustomerSidebar />
      <div className="set-frame">

        <div className="set-layout">

          {/* Main Content */}
          <main className="set-content">

            {/* Page Header */}
            <div className="set-page-header">
              <h1 className="set-page-title">Account Settings</h1>
              <p className="set-page-sub">Manage your profile information and how you interact with the platform.</p>
            </div>

            {/* Profile Card */}
            <div className="set-card set-profile-card">
              <div className="set-profile-left">
                <div className="set-avatar-wrap">
                  <img src={avatar} alt="profile" className="set-profile-img" />
                  <button
                    type="button"
                    className="set-edit-avatar-btn"
                    onClick={handleAvatarUpload}
                  >
                    ✏️
                  </button>
                </div>
                <div className="set-profile-info">
                  <div className="set-profile-name">{fullName}</div>
                  <div className="set-profile-role">Verified Customer</div>
                  <div className="set-profile-tags">
                    <span className="set-tag">📍 Member since 2024</span>
                    <span className="set-tag set-tag--verified">✔ Active</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="set-change-photo-btn"
                onClick={handleAvatarUpload}
              >
                Change Photo
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              onChange={handleAvatarFileChange}
              style={{ display: "none" }}
            />

            {/* Success/Error Message */}
            {message && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  backgroundColor: messageType === "success" ? "#d1fae5" : "#fee2e2",
                  color: messageType === "success" ? "#065f46" : "#991b1b",
                  border: `1px solid ${messageType === "success" ? "#6ee7b7" : "#fca5a5"}`,
                }}
              >
                {message}
              </div>
            )}

            {/* Two-column section */}
            <div className="set-two-col">

              {/* Personal Details */}
              <div className="set-card">
                <div className="set-card-title">
                  <span className="set-card-icon">👤</span> Personal Details
                </div>

                <div className="set-field">
                  <label className="set-label">FULL NAME</label>
                  <input
                    className="set-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="set-field">
                  <label className="set-label">EMAIL ADDRESS</label>
                  <input
                    className="set-input"
                    value={email}
                    disabled
                    style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                  />
                </div>
              </div>

              {/* Password Change */}
              <div className="set-card">
                <div className="set-card-title">
                  <span className="set-card-icon">🔐</span> Change Password
                </div>

                <div className="set-field">
                  <label className="set-label">CURRENT PASSWORD</label>
                  <input
                    className="set-input"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="set-field">
                  <label className="set-label">NEW PASSWORD</label>
                  <input
                    className="set-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="set-field">
                  <label className="set-label">CONFIRM PASSWORD</label>
                  <input
                    className="set-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            {/* Email Notifications - Two Column */}
            <div className="set-two-col">
              {/* Notifications Card */}
              <div className="set-card">
                <div className="set-card-title">
                  <span className="set-card-icon">🔔</span> Email Notifications
                </div>

                <div className="set-toggle-row">
                  <div className="set-toggle-info">
                    <div className="set-toggle-title">Project Updates</div>
                    <div className="set-toggle-sub">When someone comments on your project</div>
                  </div>
                  <button
                    className={`set-toggle ${notifications.projectUpdates ? "set-toggle--on" : ""}`}
                    onClick={() => toggleNotification("projectUpdates")}
                  >
                    <span className="set-toggle-thumb" />
                  </button>
                </div>

                <div className="set-toggle-row">
                  <div className="set-toggle-info">
                    <div className="set-toggle-title">New Asset Releases</div>
                    <div className="set-toggle-sub">Weekly digest of new 3D library items</div>
                  </div>
                  <button
                    className={`set-toggle ${notifications.newAssetReleases ? "set-toggle--on" : ""}`}
                    onClick={() => toggleNotification("newAssetReleases")}
                  >
                    <span className="set-toggle-thumb" />
                  </button>
                </div>

                <div className="set-toggle-row">
                  <div className="set-toggle-info">
                    <div className="set-toggle-title">Marketplace Sales</div>
                    <div className="set-toggle-sub">Alerts when your assets are purchased</div>
                  </div>
                  <button
                    className={`set-toggle ${notifications.marketplaceSales ? "set-toggle--on" : ""}`}
                    onClick={() => toggleNotification("marketplaceSales")}
                  >
                    <span className="set-toggle-thumb" />
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="set-card">
              <div className="set-card-title">
                <span className="set-card-icon">💳</span> Payment Method
              </div>

              <div className="set-payment-row">
                <div className="set-visa-badge">VISA</div>
                <div className="set-payment-info">
                  <div className="set-payment-title">Visa ending in 4242</div>
                  <div className="set-payment-sub">Expires 12/26 • Primary Method</div>
                </div>
                <div className="set-payment-actions">
                  <button className="set-payment-btn">Edit</button>
                  <button className="set-payment-btn set-payment-btn--blue">Update</button>
                </div>
              </div>

              <div className="set-billing-row">
                <span className="set-billing-text">
                  Your next bill is for <strong>$29.00</strong> on Oct 12, 2023
                </span>
                <button className="set-view-history">VIEW HISTORY</button>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="set-footer-actions">
              <button 
                className="set-discard-btn" 
                onClick={handleDiscard}
                disabled={loading}
              >
                Discard Changes
              </button>
              <button 
                className="set-save-btn" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save All Settings"}
              </button>
            </div>

          </main>
        </div>
      </div>
    </div>
    </>
  );
}




