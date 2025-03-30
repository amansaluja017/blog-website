import ForgotPasswordForm from "@/components/ForgotPasswordForm"


function ForgotPassword() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-base-200">
            <div className="w-full max-w-sm">
                <ForgotPasswordForm />
            </div>
        </div>
  )
}

export default ForgotPassword