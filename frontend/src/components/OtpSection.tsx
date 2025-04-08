import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Update } from "@/store/userSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";

export function OtpSection({
  otp,
  otpRef,
}: {
  otp: string;
  otpRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const submit = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/verify-otp`,
        {
          otp,
          value,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        otpRef.current?.classList.add("hidden");
        otpRef.current?.classList.remove("flex");
        console.log(response);
        dispatch(Update(response.data.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
      <button onClick={() => submit()} className="btn btn-outline btn-success">
        Submit
      </button>
    </div>
  );
}
