import { SetPasswordForm } from '@/components/SetPasswordForm'

function SetPassword() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-base-200">
        <div className="w-full max-w-sm">
            <SetPasswordForm />
        </div>
    </div>
  )
}

export default SetPassword