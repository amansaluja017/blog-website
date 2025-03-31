import { CreatePasswordForm } from '@/components/CreateNewPasswordForm'
import { useLocation } from 'react-router-dom'

function CreatePassword() {
    const {state} = useLocation();
    const {email} = state || null;
    console.log(email);


  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-base-200">
        <div className="w-full max-w-sm">
            <CreatePasswordForm email={email} />
        </div>
    </div>
  )
};

export default CreatePassword