import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Card, Alert, ProgressBar } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";

import ava from "../../assets/img/missing_avatar.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { firestore, storage } from "../../firebase";

export default function UpdateProfile() {
  const emailRef = useRef();
  const displayNameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [progress, setProgress] = useState(null);
  const [photoURL, setPhotoURL] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    currentUser,
    updatePassword,
    updateEmail,
    updateDisplayName,
    updatePhotoURL,
  } = useAuth();
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    const promises = [];
    setLoading(true);
    setError("");
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }
    if (displayNameRef.current.value) {
      promises.push(updateDisplayName(displayNameRef.current.value));
    }
    if (photoURL) {
      promises.push(updatePhotoURL(photoURL));
      if (currentUser.photoURL) storageRefFromURL(currentUser.photoURL);
    }
    Promise.all(promises)
      .then(() => {
        history.push("/user");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleUpload(e) {
    const file = e.target.files[0];
    const fileName = `${uuidv4()}.${file.type.split("/")[1]}`;
    const storageRef = storage.ref().child("userAvatar/" + fileName);
    const uploadTask = storageRef.put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload error ", error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((photoURL) => {
          const userRef = firestore.doc(`users/${currentUser.uid}`);
          userRef.update({ photoURL });
          setProgress(null);
        });
      }
    );
  }

  const onCancel = () => {
    if (photoURL) storageRefFromURL(photoURL);
    setPhotoURL(null);
  };

  function storageRefFromURL(item) {
    const desertRef = storage.refFromURL(item);
    desertRef
      .delete()
      .then(() => {
        const userRef = firestore.doc(`users/${currentUser.uid}`);
        userRef.update({ photoURL: null });
        console.log("Old photo deleted successfully");
      })
      .catch((error) => {
        console.log("Old photo deleted error!", error);
      });
  }

  useEffect(() => {
    firestore
      .doc(`users/${currentUser.uid}`)
      .onSnapshot((data) => setPhotoURL(data.data().photoURL));
  }, [currentUser]);

  return (
    <CenteredContainer>
      <Card>
        <div style={{ position: "relative" }}>
          <Card.Img
            variant="top"
            src={photoURL ? photoURL : currentUser.photoURL || ava}
          />
          <label style={{ position: "absolute", top: "10px", right: "10px" }}>
            <FontAwesomeIcon icon={faUserPlus} size="2x" />
            <input
              type="file"
              onChange={handleUpload}
              style={{ opacity: 0, position: "absolute", left: "-9999px" }}
            />
          </label>
        </div>
        <br />
        {progress && (
          <ProgressBar
            variant="primary"
            now={progress}
            max="100"
            style={{ width: "100%" }}
          />
        )}
      </Card>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                ref={displayNameRef}
                defaultValue={currentUser.displayName}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/user" onClick={onCancel}>
          Cancel
        </Link>
      </div>
    </CenteredContainer>
  );
}
