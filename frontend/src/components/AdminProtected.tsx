import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/store/confStore";

function AdminProtected({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status = useTypedSelector((state) => state.user.status);
  const userData = useTypedSelector((state) => state.user.userData);

  useEffect(() => {
    if (!status || userData?.role !== "admin") {
      navigate("/");
    }
  }, [status, userData, navigate]);

  return <>{children}</>;
}

export default AdminProtected;