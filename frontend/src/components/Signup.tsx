import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import GoogleLoginButton from "./GoogleLoginButton"
import {useForm} from 'react-hook-form'
import axios from "axios"
import { useDispatch } from "react-redux"
import { signup } from "@/store/userSlice"


export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();

    const submit = async (data: object) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/users/register`, data, {withCredentials: true});
        if(response.status === 201) {
          dispatch(signup(response.data.data));
          navigate('/blogs');
        }
      } catch (error) {
        console.log(error);
        alert("Error registering user");
      }
    }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-[#191E24] text-white border-[#0c0f13] shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Signup</CardTitle>
          <CardDescription>
            Create an account to start writing blogs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-6">
            <div className="grid gap-2">
                <Label htmlFor="email">First name</Label>
                <Input
                  id="FirstName"
                  type="text"
                  placeholder="John"
                  required
                  {...register("firstName", {required: true})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Last name</Label>
                <Input
                  id="LastName"
                  type="text"
                  placeholder="Smith"
                  {...register("lastName")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email", {required: true})}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required {...register("password", {required: true})} />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                Signup
              </Button>
              <GoogleLoginButton />
            </div>
            <div onClick={() => navigate('/login')} className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
