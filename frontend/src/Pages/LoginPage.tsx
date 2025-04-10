import { LoginForm } from "@/components/login-form"
import { useNavigate } from "react-router-dom"


function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh w-full bg-base-200 p-6 md:p-10">
      <div className="text-end">
      <button onClick={() => {
        navigate("/admin/login")
      }} className="btn btn-soft btn-info">Admin Login</button>
      </div>
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-sm ">
        <LoginForm />
      </div>
    </div>
    </div>
  )
}

export default LoginPage