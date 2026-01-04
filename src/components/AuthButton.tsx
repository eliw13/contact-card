"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { FiLogIn, FiLogOut, FiSettings } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  console.log('AuthButton status:', status);
  console.log('AuthButton session:', session);

  // Show nothing while loading
  if (status === "loading") {
    return null;
  }

  // User is signed in and is admin
  if (session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return (
      <div 
        className="auth-button-container"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => router.push('/admin')}
          className="auth-button admin-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.2)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
        >
          <FiSettings size={18} />
          <span>Admin Dashboard</span>
        </button>
        <button
          onClick={() => signOut()}
          className="auth-button signout-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(28, 28, 30, 0.8)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
        >
          <FiLogOut size={18} />
        </button>
      </div>
    );
  }

  // User is not signed in
  return (
    <>
      <button
        onClick={() => {
          console.log('Sign in button clicked!');
          setShowModal(true);
        }}
        className="auth-button signin-button"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          borderRadius: '12px',
          background: 'rgba(28, 28, 30, 0.8)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        }}
      >
        <FiLogIn size={18} />
        <span>Sign In</span>
      </button>

      {/* Sign In Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Admin Sign In</h2>
            <p>Sign in with your Google account to access admin features</p>
            
            <button
              onClick={() => signIn('google')}
              className="google-signin-button"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
            
            <button
              onClick={() => setShowModal(false)}
              className="modal-close"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
