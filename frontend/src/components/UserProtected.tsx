import { JSX, ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/store/confStore";
import { ReactNode } from "react";

function UserProtected({
  children,
  authentication = true,
}: {
  children: ReactNode;
  authentication?: boolean;
}): ReactElement {
  const navigate = useNavigate();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status: boolean = useTypedSelector((state) => state.user.status);

  useEffect(() => {
    if (authentication && status !== authentication) {
      navigate("/");
    } else if (!authentication && status !== authentication) {
      navigate("/blogs");
    }
  }, [authentication, status, navigate]);

  return <>{children}</>;
}

export default UserProtected;
