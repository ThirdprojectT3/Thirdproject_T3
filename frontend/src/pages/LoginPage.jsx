import React from "react";
import LoginForm from "../components/login/login";

const LoginPage = () => {
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
            <LoginForm />
        </div>
    );
};

export default LoginPage;
