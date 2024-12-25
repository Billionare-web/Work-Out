import { FaGithub, FaGoogle } from "react-icons/fa6";
import { Button } from "../ui/button";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/fire-config";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FillMode from "@/pages/fill-mode";

const Social = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const google = () => {
    const googleProvider = new GoogleAuthProvider();
    setIsLoading(true);

    signInWithPopup(auth, googleProvider)
      .then(() => {
        navigate("/");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const github = () => {
    const githubProvider = new GithubAuthProvider();
    setIsLoading(true);

    signInWithPopup(auth, githubProvider)
      .then(() => {
        navigate("/");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <div className="grid  grid-cols-2 mt-3 gap-3">
        {isLoading && <FillMode />}
        <Button className="w-full flex items-center gap-2" onClick={google}>
          <FaGoogle size={18} />
          <span>Google</span>
        </Button>
        <Button className="flex items-center gap-2" onClick={github}>
          <FaGithub size={18} />
          <span>GitHub</span>
        </Button>
      </div>
    </div>
  );
};

export default Social;
