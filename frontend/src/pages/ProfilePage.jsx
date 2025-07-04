import React from "react";
import ProfileForm from "../components/profile/profile";

const ProfilePage = () => {
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
            <ProfileForm />
        </div>
    );
};

export default ProfilePage;