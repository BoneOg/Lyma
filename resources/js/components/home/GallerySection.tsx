import React, { useState } from "react";

const GallerySection: React.FC = () => {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const sendTestEmail = async () => {
    try {
      setSending(true);
      setStatus(null);
      const res = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
        },
      });
      const data = await res.json();
      if (data.success) setStatus('Email sent successfully.');
      else setStatus(data.message || 'Failed to send email.');
    } catch (e) {
      setStatus('Failed to send email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="gallery-section" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Gallery</h2>
        <p className="text-lg text-gray-600 mb-6">A gallery of our restaurant will be displayed here soon.</p>
        <button
          onClick={sendTestEmail}
          disabled={sending}
          className="bg-olive text-beige px-6 py-3 disabled:opacity-60"
        >
          {sending ? 'Sending…' : 'Send Test Email'}
        </button>
        {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
      </div>
    </section>
  );
};

export default GallerySection;