import { AdminLoginForm } from "@/components/AdminLoginForm"

function AdminLoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-base-200">
      <div className="w-full max-w-sm ">
        <AdminLoginForm />
      </div>
    </div>
  )
}

export default AdminLoginPage