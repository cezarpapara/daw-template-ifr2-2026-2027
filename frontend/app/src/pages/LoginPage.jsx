import { useState } from 'react'
import './LoginPage.css'

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <>
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
