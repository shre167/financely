import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignupSigninComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  const provider = new GoogleAuthProvider();

  function signupWithEmail() {
    setLoading(true);

    if (name && email && password && confirmpassword) {
      if (password === confirmpassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            toast.success("User Created!");
            createDoc(user);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            navigate("/dashboard");
          })
          .catch((error) => {
            toast.error(error.message);
          })
          .finally(() => setLoading(false));
      } else {
        toast.error("Passwords do not match!");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(userRef, {
          name: user.displayName || name,
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: new Date(),
        });
        toast.success("Document created!");
      } catch (e) {
        toast.error(e.message);
      }
    } else {
     // toast.error("User document already exists.");
    }
  }

  function googleAuth() {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        toast.success("User authenticated with Google!");
        await createDoc(user);
        navigate("/dashboard");
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  }

  function loginUsingEmail() {
    setLoading(true);
    
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success("Logged in successfully!");
          navigate("/dashboard");
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => setLoading(false));
    } else {
      toast.error("Email and password are required!");
      setLoading(false);
    }
  }

  return loginForm ? (
    <div className="signup-wrapper">
      <h2 className="title">
        Login on <span style={{ color: "var(--theme)" }}>Financely.</span>
      </h2>
      <form>
        <Input
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder={"JohnDoe@gmail.com"}
        />
        <Input
          type="password"
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"Example@123"}
        />
        <Button
          disabled={loading}
          text={loading ? "Loading..." : "Login Using Email and Password"}
          onClick={loginUsingEmail}
        />
        <p className="p-login">or</p>
        <Button
          onClick={googleAuth}
          text={loading ? "Loading..." : "Login Using Google"}
          blue={true}
        />
        <p
          className="p-login"
          style={{ cursor: "pointer" }}
          onClick={() => setLoginForm(false)}
        >
          Don't Have an Account Already? Click Here
        </p>
      </form>
    </div>
  ) : (
    <div className="signup-wrapper">
      <h2 className="title">
        Sign Up on <span style={{ color: "var(--theme)" }}>Financely.</span>
      </h2>
      <form>
        <Input
          label={"Full Name"}
          state={name}
          setState={setName}
          placeholder={"John Doe"}
        />
        <Input
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder={"JohnDoe@gmail.com"}
        />
        <Input
          type="password"
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"Example@123"}
        />
        <Input
          type="password"
          label={"Confirm Password"}
          state={confirmpassword}
          setState={setConfirmPassword}
          placeholder={"Example@123"}
        />
        <Button
          disabled={loading}
          text={loading ? "Loading..." : "Signup Using Email and Password"}
          onClick={signupWithEmail}
        />
        <p className="p-login">or</p>
        <Button
          onClick={googleAuth}
          text={loading ? "Loading..." : "Signup Using Google"}
          blue={true}
        />
        <p
          className="p-login"
          style={{ cursor: "pointer" }}
          onClick={() => setLoginForm(true)}
        >
          Already Have an Account? Click Here
        </p>
      </form>
    </div>
  );
}

export default SignupSigninComponent;
