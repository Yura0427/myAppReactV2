import React from "react";
import { Button, Card, Col, Form, ProgressBar, Toast } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { firestore, storage } from "../firebase";
import {
  fetchBrend,
  fetchType,
  fetchFrameMaterial,
} from "../redux/category-reducer";
import { Preloader } from "./preloader/Preloader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

export default function Admin() {
  const brendRef = React.useRef();
  const typeRef = React.useRef();
  const frameMaterialRef = React.useRef();
  const priceRef = React.useRef();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const promises = [];
    promises.push(dispatch(fetchBrend()));
    promises.push(dispatch(fetchType()));
    promises.push(dispatch(fetchFrameMaterial()));
    Promise.all(promises)
      .then(() => {
        // console.log("vse ok");
      })
      .catch((err) => {
        console.log("Failed fetching ", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  const { brend, type, frameMaterial } = useSelector(({ category }) => {
    return {
      brend: category.brend,
      type: category.type,
      frameMaterial: category.frameMaterial,
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    firestore
      .collection("product")
      .add({
        brendName: brendRef.current.value,
        type: typeRef.current.value,
        price: +priceRef.current.value,
        frameMaterial: frameMaterialRef.current.value,
        dateAdd: new Date(),
        productImage: photoURL,
      })
      .then((docRef) => {
        e.target.reset();
        setPhotoURL(null);
        setUploadLabel("Файл не вибрано...");
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const [progress, setProgress] = React.useState(null);
  const [photoURL, setPhotoURL] = React.useState(null);
  const [uploadLabel, setUploadLabel] = React.useState("Файл не вибрано...");
  function handleUpload(e) {
    setUploadLabel(e.target.files[0].name);
    if (photoURL) {
      const desertRef = storage.refFromURL(photoURL);
      desertRef
        .delete()
        .then(() => {
          console.log("Old file deleted successfully");
        })
        .catch((error) => {
          console.log("Old file deleted error!", error);
        });
    }
    const file = e.target.files[0];
    const fileName = `${uuidv4()}.${file.type.split("/")[1]}`;
    const storageRef = storage.ref().child("productImage/" + fileName);
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
          setPhotoURL(photoURL);
          setProgress(null);
        });
      }
    );
  }
  if (isLoading) return <Preloader />;
  return (
    <>
      <Card style={{ width: "80%", margin: "10px auto" }}>
        <Card.Header>Add product</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Row>
                <Col>
                  <Form.Label>Brend</Form.Label>
                  <Form.Control
                    as="select"
                    required
                    name={"brendName"}
                    ref={brendRef}
                  >
                    <option disabled selected />
                    {brend &&
                      brend.map((item, i) => {
                        return (
                          <option key={i} value={item}>
                            {item}
                          </option>
                        );
                      })}
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    as="select"
                    required
                    name={"type"}
                    ref={typeRef}
                  >
                    <option disabled selected />
                    {type &&
                      type.map((item, i) => {
                        return (
                          <option key={i} value={item}>
                            {item}
                          </option>
                        );
                      })}
                  </Form.Control>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Col>
                  <Form.Label> Material frame</Form.Label>
                  <Form.Control
                    as="select"
                    required
                    name={"frameMaterial"}
                    ref={frameMaterialRef}
                  >
                    <option disabled selected />
                    {frameMaterial &&
                      frameMaterial.map((item, i) => {
                        return (
                          <option key={i} value={item}>
                            {item}
                          </option>
                        );
                      })}
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    as="input"
                    type="number"
                    required
                    placeholder="Enter price (numbers only)"
                    ref={priceRef}
                  />
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <label>
                <FontAwesomeIcon icon={faUpload} size="2x" />
                <Form.Label className="m-2">{uploadLabel}</Form.Label>
                {progress && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      right: "1rem",
                      minWidth: "150px",
                      maxWidth: "200px",
                    }}
                  >
                    <Toast>
                      <Toast.Header closeButton={false}>
                        <strong className="mr-auto">{uploadLabel}</strong>
                      </Toast.Header>
                      <Toast.Body>
                        <ProgressBar
                          now={progress}
                          label={`${Math.round(progress)}%`}
                        />
                      </Toast.Body>
                    </Toast>
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleUpload}
                  required
                  style={{ opacity: 0, position: "absolute", left: "-9999px" }}
                />
              </label>
              {photoURL && <img src={photoURL} width="100%" />}
            </Form.Group>
            <Button type="submit">Add product</Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
