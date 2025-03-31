import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { set, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";

function ForgotPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { register, handleSubmit } = useForm();

  const [otpPanel, setOtpPanel] = useState(false);
  const [value, setValue] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const submit = async (data: any) => {
    setEmail(data.email);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/check-user`,
        data,
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log(response.data.data.otp)
        setOtp(response.data.data.otp);
        setOtpPanel(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const verifyOtp = () => {
    if (value !== otp) {
      alert("Invalid OTP");
      return;
    }
    navigate("/create-password", {state: {email}});
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="bg-[#191E24] text-white border-[#0c0f13] shadow-2xl">
        <CardHeader>
          <CardTitle>Enter Email</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="currPassword">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {otpPanel && (
        <div className="absolute flex w-full h-full backdrop-blur-sm text-white">
          <div className="flex flex-col gap-8">
            <InputOTP onChange={(e) => setValue(e)} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <button
              onClick={() => verifyOtp()}
              className="btn btn-outline btn-success">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPasswordForm;
