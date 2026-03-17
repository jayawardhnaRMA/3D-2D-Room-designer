import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoggedInNavbar from '../../components/LoggedInNavbar';
import DesignerSidebar from '../../components/DesignerSidebar';
import { Search, UserPlus, ChevronRight, X, Phone, MapPin, Mail } from 'lucide-react';
import { clientAPI } from '../../services/clientAPI';
import '../../styles/designer/Clients.css';

const Clients = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [activeFilter, setActiveFilter] = useState('All Statuses');
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const hasLoadedRef = useRef(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const filters = ['Active', 'Pending', 'Completed'];

  const filterStatuses = ['All Statuses', ...filters];

  // Load clients on mount
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadClients = async () => {
      try {
        if (user?.id) {
          const response = await clientAPI.getClients(user.id);
          setClients(response.clients || []);
          if (response.clients?.length > 0) {
            setSelectedClient(response.clients[0]);
          }
        }
      } catch (error) {
        console.error("Error loading clients:", error);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [user]);

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      if (!user?.id) {
        alert("User not found. Please log in again.");
        return;
      }

      console.log("Creating client with data:", formData);
      const response = await clientAPI.createClient(user.id, formData);
      
      console.log("Client created response:", response);
      
      setClients([response.client, ...clients]);
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        notes: '',
      });
      setSelectedClient(response.client);
      alert("Client added successfully!");
    } catch (error) {
      console.error("Error creating client:", error);
      const errorMessage = error?.message || "Error creating client. Please try again.";
      alert(errorMessage);
    }
  };

  const handleStartDesign = () => {
    if (selectedClient) {
      navigate("/room-wizard", {
        state: {
          from: "/designer/clients",
          clientId: selectedClient._id,
          clientName: selectedClient.name,
        },
      });
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesFilter =
      activeFilter === 'All Statuses' || client.status === activeFilter;
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Completed':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <>
      <LoggedInNavbar userRole="designer" />
      <div className="des-wrapper">
        <DesignerSidebar />
        <div className="des-frame">
          <div className="des-layout">
            <main className="des-content" style={{ height: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", flex: 1, overflow: "hidden", background: "#f9fafb" }}>
                {/* Left - Clients List */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
                  {/* Title & Search */}
                  <div style={{ padding: "32px 32px 24px", flexShrink: 0 }}>
                    <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>Clients</h1>
                    <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>Manage your clients and projects</p>

                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      {/* Search */}
                      <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
                        <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", width: 18 }} />
                        <input
                          type="text"
                          placeholder="Search clients..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            width: "100%",
                            paddingLeft: "40px",
                            paddingRight: "16px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            background: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>

                      {/* Filter & Add Button */}
                      {filterStatuses.map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setActiveFilter(filter)}
                          style={{
                            padding: "10px 16px",
                            border: activeFilter === filter ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                            background: activeFilter === filter ? "#eff6ff" : "white",
                            color: activeFilter === filter ? "#2563eb" : "#374151",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {filter}
                        </button>
                      ))}

                      <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                          padding: "10px 16px",
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginLeft: "auto",
                        }}
                      >
                        <UserPlus size={16} />
                        Add Client
                      </button>
                    </div>
                  </div>

                  {/* Clients Table */}
                  <div style={{ padding: "0 32px 32px", flex: 1, overflowY: "auto", minWidth: 0 }}>
                    <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "#f3f4f6", borderBottom: "1px solid #e5e7eb" }}>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Name</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Contact</th>
                            <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Status</th>
                            <th style={{ textAlign: "center", padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredClients.length > 0 ? (
                            filteredClients.map((client, index) => (
                              <tr
                                key={client._id}
                                onClick={() => setSelectedClient(client)}
                                style={{
                                  borderBottom: index < filteredClients.length - 1 ? "1px solid #f3f4f6" : "none",
                                  background: selectedClient?._id === client._id ? "#eff6ff" : "white",
                                  cursor: "pointer",
                                  transition: "background 0.2s",
                                }}
                                onMouseOver={(e) => !selectedClient?._id === client._id && (e.currentTarget.style.background = "#f9fafb")}
                                onMouseOut={(e) => !selectedClient?._id === client._id && (e.currentTarget.style.background = "white")}
                              >
                                <td style={{ padding: "16px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <div style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      background: "#3b82f6",
                                      color: "white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: "600",
                                      fontSize: "14px",
                                    }}>
                                      {client.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span style={{ fontWeight: "500", color: "#111827" }}>{client.name}</span>
                                  </div>
                                </td>
                                <td style={{ padding: "16px", color: "#6b7280", fontSize: "14px" }}>{client.email}</td>
                                <td style={{ padding: "16px" }}>
                                  <span style={{
                                    padding: "4px 12px",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    ...(() => {
                                      const styles = getStatusStyle(client.status).split(" ");
                                      if (client.status === "Active") return { background: "#dcfce7", color: "#166534" };
                                      if (client.status === "Pending") return { background: "#fef3c7", color: "#92400e" };
                                      return { background: "#f3f4f6", color: "#4b5563" };
                                    })(),
                                  }}>
                                    {client.status}
                                  </span>
                                </td>
                                <td style={{ padding: "16px", textAlign: "center" }}>
                                  <ChevronRight size={18} style={{ color: "#9ca3af" }} />
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" style={{ padding: "40px 16px", textAlign: "center", color: "#9ca3af" }}>
                                No clients found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right - Client Details */}
                {selectedClient && (
                  <div style={{
                    width: "380px",
                    background: "white",
                    borderLeft: "1px solid #e5e7eb",
                    overflowY: "auto",
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}>
                    <div style={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>Client Details</h3>
                      
                      <div style={{ space: "16px" }}>
                        <div style={{ marginBottom: "16px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", display: "block", marginBottom: "4px" }}>NAME</label>
                          <p style={{ color: "#111827", fontSize: "14px" }}>{selectedClient.name}</p>
                        </div>

                        <div style={{ marginBottom: "16px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <Mail size={16} style={{ color: "#6b7280", marginTop: "4px" }} />
                          <div>
                            <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>EMAIL</p>
                            <p style={{ color: "#111827", fontSize: "14px" }}>{selectedClient.email}</p>
                          </div>
                        </div>

                        {selectedClient.phone && (
                          <div style={{ marginBottom: "16px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                            <Phone size={16} style={{ color: "#6b7280", marginTop: "4px" }} />
                            <div>
                              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>PHONE</p>
                              <p style={{ color: "#111827", fontSize: "14px" }}>{selectedClient.phone}</p>
                            </div>
                          </div>
                        )}

                        {selectedClient.address && (
                          <div style={{ marginBottom: "16px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                            <MapPin size={16} style={{ color: "#6b7280", marginTop: "4px" }} />
                            <div>
                              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>ADDRESS</p>
                              <p style={{ color: "#111827", fontSize: "14px" }}>{selectedClient.address}</p>
                              {selectedClient.city && <p style={{ color: "#111827", fontSize: "14px" }}>{selectedClient.city}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ padding: "24px", flex: 1 }}>
                      <button
                        onClick={handleStartDesign}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          marginBottom: "12px",
                        }}
                      >
                        Start New Design
                      </button>
                      <p style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
                        Create a new design project for {selectedClient.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827" }}>Add New Client</h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <X size={24} style={{ color: "#6b7280" }} />
              </button>
            </div>

            <form onSubmit={handleAddClient}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    minHeight: "100px",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: "1px solid #d1d5db",
                    background: "white",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: "none",
                    background: "#3b82f6",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Clients;
