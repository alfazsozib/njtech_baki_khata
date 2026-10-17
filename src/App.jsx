import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

function App() {


  return (
    <div className='flex main-h-screen flex-col bg-background text-foreground'>
      <Navbar 
      onSignInClick={()=> alert("Sign in")}
      onSignUpClick={()=> alert("Sign Up")}
      />

       <main  className="flex-1 flex items-center justify-center p-6 text-center">
      <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome to Baki Khata</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Your smart digital ledger with built-in AI risk analysis.
          </p>
        </div>
    </main>

  {/* <Footer /> */}
    </div>

   
  )
}

export default App
