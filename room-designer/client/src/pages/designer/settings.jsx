import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import pencilButton from '../../assets/pencilButton.png';
import defaultAvatar from '../../assets/avatar1.jpg';
import { Bell, CheckCircle, CreditCard } from 'lucide-react';
import Sidebar from '../../components/DesignerSidebar';
import LoggedInNavbar from '../../components/LoggedInNavbar';

const Settings = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [notifications, setNotifications] = useState({
    projectUpdates: true,
    assetReleases: true,
    marketplaceSales: false
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    avatar: defaultAvatar
  });

  const avatarInputRef = useRef(null);
  const [avatarTouched, setAvatarTouched] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const userData = response.data.user;
          setFormData({
            fullName: userData.name || '',
            email: userData.email || '',
            avatar: userData.avatar || defaultAvatar
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('designerNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    fetchUserData();
  }, []);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
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
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
      input.value = '';
    };
    reader.readAsDataURL(file);
    setAvatarTouched(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage('');

      // Validate passwords if changing password
      if (passwordData.newPassword) {
        if (!passwordData.currentPassword) {
          setMessageType('error');
          setMessage('Current password is required to change password');
          setLoading(false);
          return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setMessageType('error');
          setMessage('New passwords do not match');
          setLoading(false);
          return;
        }
        if (passwordData.newPassword.length < 6) {
          setMessageType('error');
          setMessage('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/auth/profile',
        {
          name: formData.fullName,
          avatar: formData.avatar,
          ...(passwordData.newPassword && {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          }),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const updatedUser = response.data.user;
        // Update AuthContext with new user data
        updateUser(updatedUser);
        // Also persist to localStorage for fallback
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setFormData({
          fullName: updatedUser.name || '',
          email: updatedUser.email || '',
          avatar: updatedUser.avatar || defaultAvatar
        });

        // Save notifications to localStorage
        localStorage.setItem('designerNotifications', JSON.stringify(notifications));

        const successParts = [];
        if (avatarTouched) successParts.push('Profile picture updated');
        if (passwordData.newPassword) successParts.push('Password changed');
        const successMessage = successParts.length
          ? successParts.join(' and ')
          : 'Profile updated successfully!';

        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        setMessageType('success');
        setMessage(successMessage);
        setTimeout(() => setMessage(''), 3000);
        setAvatarTouched(false);
        if (avatarInputRef.current) {
          avatarInputRef.current.value = '';
        }

        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedUser }));
      }
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const user = response.data.user;
        setFormData({
          fullName: user.name || '',
          email: user.email || '',
          avatar: user.avatar || defaultAvatar
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage('');
    const savedNotificationsDiscard = localStorage.getItem('designerNotifications');
    if (savedNotificationsDiscard) {
      setNotifications(JSON.parse(savedNotificationsDiscard));
    }
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
    setAvatarTouched(false);
  };

  return (
    <>
      <LoggedInNavbar userRole="designer" />
      <div className="des-wrapper">
        <Sidebar />
        <div className="des-frame">
          <div className="des-layout">
            <main className="des-content">
          <div className="max-w-5xl mx-auto px-8 py-8">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
              <p className="text-gray-600">Manage your profile information and how you interact with the platform.</p>
            </div>

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

            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={formData.avatar}
                    alt="profile"
                    className="w-24 h-24 rounded-lg border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-6 -right-4">
                    <button
                      type="button"
                      onClick={handleAvatarUpload}
                      className="cursor-pointer"
                      aria-label="Change profile photo"
                    >
                      <img
                        src={pencilButton}
                        alt="Edit"
                        className="w-10 h-10"
                      />
                    </button>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{formData.fullName}</h2>
                      <p className="text-sm text-gray-600">Verified Designer</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAvatarUpload}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Change Photo
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-md">
                      <CheckCircle size={14} className="text-blue-600" />
                      <span className="text-xs font-semibold text-blue-600">Active Member</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              onChange={handleAvatarFileChange}
              style={{ display: 'none' }}
            />

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Personal Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Personal Details</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email Notifications */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Bell size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Email Notifications</h3>
                </div>

                <div className="space-y-4">
                  {/* Project Updates */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Project Updates</p>
                      <p className="text-xs text-gray-500">Notify if people comment on your project</p>
                    </div>
                    <button
                      onClick={() => toggleNotification('projectUpdates')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.projectUpdates ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.projectUpdates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* New Asset Releases */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">New Asset Releases</p>
                      <p className="text-xs text-gray-500">Weekly digest of new 3D library items</p>
                    </div>
                    <button
                      onClick={() => toggleNotification('assetReleases')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.assetReleases ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.assetReleases ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Marketplace Sales */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Marketplace Sales</p>
                      <p className="text-xs text-gray-500">Alerts when your assets are purchased</p>
                    </div>
                    <button
                      onClick={() => toggleNotification('marketplaceSales')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.marketplaceSales ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.marketplaceSales ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <CreditCard size={20} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Visa ending in 4242</p>
                    <p className="text-xs text-gray-500">Expiry 12/2027 • Primary Method</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Update
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <p className="text-gray-600">Your next bill is for <span className="font-semibold text-gray-900">$29.00</span> on Oct 12, 2023</p>
                <button className="text-blue-600 hover:text-blue-700 font-semibold">
                  VIEW HISTORY
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleDiscard}
                disabled={loading}
                className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Discard Changes
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save All Settings"}
              </button>
            </div>
          </div>
          </main>
        </div>
      </div>
    </div>
    </>
  );
};

export default Settings;