import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="container py-16 text-center animate-fade-in" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#dcfce3',
        color: '#166534',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.5rem',
        marginBottom: '2rem'
      }}>
        ✓
      </div>
      <h1 className="font-bold text-primary mb-4" style={{ fontSize: '2.5rem' }}>Booking Request Received!</h1>
      <p className="text-light mb-8 max-w-2xl mx-auto" style={{ fontSize: '1.25rem' }}>
        Thank you for choosing TravaNora Travel PVT LTD. Our travel agents will review your request and get back to you within 24 hours to confirm the details and proceed with the payment.
      </p>
      <Link href="/" className="btn-primary">
        Return to Home
      </Link>
    </div>
  );
}
