import React from "react";
import { Form, Button } from "react-bootstrap";
import InputField from "../components/InputField";
import Main from "../components/Main";
import { Link, useNavigate} from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import { toast } from "react-toastify";
import { useIsAuthenticated, useSignIn } from 'react-auth-kit'

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {

  // Check if user is authenticated
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()

  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  const emailField = React.useRef<HTMLInputElement>(null);
  const passwordField = React.useRef<HTMLInputElement>(null);

  const signIn = useSignIn()

  const api = useApi();

  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = emailField.current ? emailField.current.value : "";
    const password = passwordField.current ? passwordField.current.value : "";
    console.log("I will start from Here");
    console.log(`You entered ${email}:${password}`);

    const result = await api.login(email, password)
    
    // Check for response type if it is successful
    if (typeof result === "object" && result.body!== null ) {

      if (signIn({
        token: result.body.data.accessToken,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: result.body.data.user
      })) {
        // Log user in
        navigate("/")
      }
      else {
        console.log("something happened")
      }
    }
    // If login fails
    else if (result === "fail") {
      toast.error("Invalid credentials. Try again", {
        position: toast.POSITION.TOP_CENTER,
        theme: "colored"
      });
    }
    else {
      console.log("Something went wrong")
    }

    const errors: FormErrors = {};
    if (!email) {
      errors.email = "Email must not be empty.";
    }
    if (!password) {
      errors.password = "Password must not be empty.";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
  }

  return (
    <Main>
      <h1>Login</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="email"
          label="Email address"
          type="email"
          error={formErrors.email}
          fieldRef={emailField}
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          error={formErrors.password}
          fieldRef={passwordField}
        />
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <hr />
      <p>Forgot your password? You can <Link to="/forgotpassword">reset it</Link>.</p>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>!
      </p>
    </Main>
  );
}
