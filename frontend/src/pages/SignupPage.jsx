import React from "react";
import SignUpForm from "../components/signup/signup";

const SignupPage = () => {
    return (
        <div
            style={{
                backgroundColor: "#ffffff",
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <SignUpForm />
        </div>
    );
};

export default SignupPage;
