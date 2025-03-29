import { TypedUseSelectorHook, useSelector } from "react-redux";
import { Hero } from "../components"
import { useNavigate } from "react-router-dom"
import { RootState } from "@/store/confStore";
import { useEffect } from "react";

function Home() {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const status: boolean = useTypedSelector((state) => state.user.status);
  const navigate = useNavigate();

  useEffect(() => {
    if (status) {
      navigate("/login");
    }
  }, [status, navigate]);


  return (
    <div>
        <Hero />
    </div>
  )
}

export default Home