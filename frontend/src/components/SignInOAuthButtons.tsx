import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { axiosInstance } from "../lib/axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignInOAuthButtons = () => {
  const { signIn, isLoaded } = useSignIn();
  const navigate = useNavigate();

  useEffect(() => {
    const createUserAfterAuth = async () => {
      if (window.location.pathname === "/auth/callback") {
        try {
          const res = await axiosInstance.get("/me");
          const { id, firstName, lastName, imageUrl } = res.data;

          await axiosInstance.post("/auth/callback", {
            id,
            firstName,
            lastName,
            imageUrl,
          });

          navigate("/");
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    };

    createUserAfterAuth();
  }, [navigate]);

  if (!isLoaded) {
    return null;
  }

  const signInWithGoogle = () => {
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/auth-callback",
    });
  };

  return (
    <Button
      onClick={signInWithGoogle}
      variant={"secondary"}
      className="w-full text-white border-zinc-200 h-11"
    >
      <img src="/google.png" alt="Google" className="size-5" />
      Continue with Google
    </Button>
  );
};
export default SignInOAuthButtons;
