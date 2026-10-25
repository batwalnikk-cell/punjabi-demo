import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Eye, Check, AlertCircle, Calendar, User, Phone } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const CustomInquiriesManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [actionNotice, setActionNotice] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.getInquiries();
      if (res.success) {
        setInquiries(res.inquiries || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id, status, adminNotes) => {
    try {
      const res = await api.updateInquiryStatus(id, status, adminNotes);
      if (res.success) {
        setActionNotice(`Inquiry status updated to ${status}`);
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(res.inquiry);
        }
        fetchInquiries();
        setTimeout(() => setActionNotice(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update inquiry');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>Bespoke Custom Orders & Inquiries</h1>
        <p style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem' }}>
          Customer requests for personalized embroidery, custom silhouettes, and bespoke bridal Punjabi suits.
        </p>
      </div>

      {actionNotice && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <Check size={18} /> {actionNotice}
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Retrieving custom inquiries..." />
      ) : inquiries.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', padding: '3rem', textAlign: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
          <Sparkles size={36} color="var(--color-gold)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Custom Inquiries Yet</h3>
          <p style={{ color: 'var(--color-gray-medium)' }}>
            Customer inquiries submitted through the custom orders form will appear here.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Inquiry Ref</th>
                <th>Client</th>
                <th>Embroidery Desired</th>
                <th>Suit Cut</th>
                <th>Budget & Date</th>
                <th>Status</th>
                <th>Received</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id}>
                  <td>
                    <strong style={{ color: 'var(--color-maroon)' }}>{inq.inquiryNumber}</strong>
                    {inq.referenceImage && (
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                        📷 Photo attached
                      </span>
                    )}
                  </td>
                  <td>
                    <strong style={{ display: 'block', fontSize: '0.92rem' }}>{inq.customerName}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-gray-light)' }}>{inq.customerPhone}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{inq.embroideryType}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray-light)' }}>
                      Fabric: {inq.fabricPreference}
                    </span>
                  </td>
                  <td>{inq.suitType}</td>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                      {inq.budgetRange || 'Flexible'}
                    </span>
                    {inq.targetDate && (
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray-light)' }}>
                        Target: {inq.targetDate}
                      </span>
                    )}
                  </td>
                  <td>
                    <select
                      value={inq.status}
                      onChange={(e) => handleUpdateStatus(inq.id, e.target.value, inq.adminNotes)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        backgroundColor: inq.status === 'NEW' ? '#FEF3C7' : inq.status === 'ACCEPTED' ? '#DCFCE7' : '#FFF',
                      }}
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="DESIGNING">DESIGNING</option>
                      <option value="QUOTED">QUOTED</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--color-gray-medium)' }}>
                    {new Date(inq.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelectedInquiry(inq)}>
                      <Eye size={15} /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {selectedInquiry && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              padding: '2.5rem',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-modal)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600 }}>
                  Custom Suit Inquiry
                </span>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--color-maroon)' }}>{selectedInquiry.inquiryNumber}</h2>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedInquiry(null)}>
                Close
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', backgroundColor: 'var(--color-ivory)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-gray-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Client Name</strong>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>{selectedInquiry.customerName}</span>
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-gray-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Phone / WhatsApp</strong>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>{selectedInquiry.customerPhone}</span>
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-gray-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Fabric Preference</strong>
                <span>{selectedInquiry.fabricPreference}</span>
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-gray-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Embroidery Type</strong>
                <span>{selectedInquiry.embroideryType}</span>
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-gray-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Color Desired</strong>
                <span>{selectedInquiry.colorPreference}</span>
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-gray-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Budget</strong>
                <span>{selectedInquiry.budgetRange || 'Flexible'}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Design & Embroidery Notes</h4>
              <p style={{ backgroundColor: '#FAF8F5', padding: '1rem', borderRadius: 'var(--radius-sm)', lineHeight: '1.6', fontSize: '0.92rem', whiteSpace: 'pre-line' }}>
                {selectedInquiry.requirements}
              </p>
            </div>

            {selectedInquiry.referenceImage && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Reference Image Uploaded by Client</h4>
                <a href={selectedInquiry.referenceImage} target="_blank" rel="noopener noreferrer">
                  <img
                    src={selectedInquiry.referenceImage}
                    alt="Reference suit design"
                    style={{ maxHeight: '250px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                </a>
              </div>
            )}

            {/* Direct WhatsApp Action */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <a
                href={`https://wa.me/${selectedInquiry.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedInquiry.customerName)},%20this%20is%20Punjab%20Royal%20Suits%20regarding%20your%20custom%20embroidery%20inquiry%20${selectedInquiry.inquiryNumber}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ flex: 1, backgroundColor: '#25D366', borderColor: '#25D366' }}
              >
                <MessageCircle size={18} /> Chat with Client on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
