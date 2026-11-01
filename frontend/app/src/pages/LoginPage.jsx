import { useState } from 'react'

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px;
          background: #f4f1e9;
          color: #263c35;
          font-family: Georgia, serif;
        }
        .login-book {
          width: min(100%, 400px);
          height: 440px;
          perspective: 1000px;
        }
        .login-sheet {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 700ms ease;
        }
        .login-book.signup .login-sheet { transform: rotateY(-180deg); }
        .login-side {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
          padding: 40px;
          border: 1px solid #ded8c9;
          border-radius: 6px;
          background: #fffdf7;
          box-shadow: 0 16px 40px #263c3520;
          backface-visibility: hidden;
        }
        .login-side h1 { margin: 0; font-size: 32px; font-weight: 400; }
        .login-side input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d8d6cc;
          border-radius: 3px;
          font: 14px Arial, sans-serif;
        }
        .login-side button {
          padding: 12px;
          border: 0;
          border-radius: 3px;
          background: #263c35;
          color: white;
          cursor: pointer;
        }
        .login-side .login-switch {
          padding: 0;
          background: transparent;
          color: #745a32;
        }
        .login-back { transform: rotateY(180deg); }
        @media (prefers-reduced-motion: reduce) {
          .login-sheet { transition-duration: 1ms; }
        }
      `}</style>

      <main className="login-page">
        <div className={`login-book${isSignUp ? ' signup' : ''}`}>
          <div className="login-sheet">
            <form className="login-side login-front" onSubmit={handleSubmit}>
              <h1>Login</h1>
              <input aria-label="Email" type="email" placeholder="Email" autoComplete="email" required />
              <input aria-label="Password" type="password" placeholder="Password" autoComplete="current-password" required />
              <button type="submit">Login</button>
              <button className="login-switch" type="button" onClick={() => setIsSignUp(true)}>
                Sign up
              </button>
            </form>

            <form className="login-side login-back" onSubmit={handleSubmit}>
              <h1>Sign up</h1>
              <input aria-label="Name" type="text" placeholder="Name" autoComplete="name" required />
              <input aria-label="Email" type="email" placeholder="Email" autoComplete="email" required />
              <input aria-label="Password" type="password" placeholder="Password" autoComplete="new-password" minLength={8} required />
              <button type="submit">Sign up</button>
              <button className="login-switch" type="button" onClick={() => setIsSignUp(false)}>
                Login
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}

export const LoginFunction = LoginPage
export default LoginPage
