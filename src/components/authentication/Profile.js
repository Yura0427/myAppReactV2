import React, { useState } from "react";
import { Card, Button, Alert, CardGroup } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";
import ava from "../../assets/img/missing_avatar.svg";

export default function Profile() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <CenteredContainer>
      <h2 className="text-center mb-4">Profile</h2>
      <CardGroup>
        <Card>
          <div style={{ position: "relative" }}>
            <Card.Img
              variant="top"
              src={currentUser.photoURL ? currentUser.photoURL : ava}
            />
          </div>
        </Card>
        <Card>
          <Card.Body>
            <strong>Name:</strong> {currentUser.displayName} <br />
            <strong>Email:</strong> {currentUser.email} <br />
            <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
              Update Profile
            </Link>
          </Card.Body>
        </Card>
      </CardGroup>

      <div className="w-100 text-center mt-2">
        {error && <Alert variant="danger">{error}</Alert>}
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </CenteredContainer>
  );
}
