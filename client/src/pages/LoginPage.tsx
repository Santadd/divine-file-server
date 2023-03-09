import React from "react";
import { Form, Button, Container } from "react-bootstrap";
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
    

    const result = await api.login(email, password)
    
    // Check for response type if it is successful
    if (typeof result === "object" ) {
      
      if (result.ok) {
        
        if (signIn({
          token: result.body.data.accessToken,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: result.body.data.user
        })) {
          // Log user in
          localStorage.setItem("_auth", result.body.data.accessToken)
          navigate("/")
        }
        else {
          console.log("something happened")
        }
      }
      // Login fails
      else {
          toast.error(result.body.message, {
        position: toast.POSITION.TOP_CENTER,
        theme: "colored"
      });
      }
      
    }
    else {
      console.log("Something went wrong")
      toast.error("Invalid credentials", {
        position: toast.POSITION.TOP_CENTER,
        theme: "colored"
      });
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
      <Container className="col-md-5 mx-auto mt-5 Auth">
      <h3>Login</h3>
      <Form onSubmit={onSubmit}>
        <InputField
          name="email"
          label="Email address"
          type="email"
          error={formErrors.email}
          fieldRef={emailField}
          required
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          error={formErrors.password}
          fieldRef={passwordField}
          required
        />
        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
      <hr />
      <p>Forgot your password? You can <Link to="/forgotpassword">reset it</Link>.</p>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>!
      </p>
      </Container>
    </Main>
  );
}
