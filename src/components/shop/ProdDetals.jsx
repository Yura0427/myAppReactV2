import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { firestore } from "../../firebase";
import { setOrders } from "../../redux/category-reducer";
import { Preloader } from "../preloader/Preloader";

const ProdDetals = (props) => {
  console.log("ProdDetals", props);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const docRef = firestore.collection("product").doc(props.match.params.id);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setProduct(doc.data());
          setLoading(false);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, []);
  
  const buy = (e) => {
    const item = { ...product, id: e.target.name, quantity: 1 }
    if (!localStorage.getItem("session_json")) {
      localStorage.setItem(
        "session_json",
        JSON.stringify({ purchases: [item] })
      );
      dispatch(setOrders([item]))
    } else {
      let arr = JSON.parse(localStorage.getItem("session_json")).purchases;
      if (arr.length >= 0) {
        if (!arr.find((el) => el.id == e.target.name)) {
          arr.push(item);
        }
      }
      localStorage.setItem("session_json", JSON.stringify({ purchases: arr }));
      dispatch(setOrders(arr))

    }
  };

  return (
    <div>
      {loading ? (
        <Preloader />
      ) : (
        <Card style={{ width: "95%", margin: "5px auto" }}>
          <Card.Img
            variant="top"
            src={product.productImage ? product.productImage : null}
          />
          <Card.Body>
            <Card.Text>Бренд: {product.brendName}</Card.Text>
            <Card.Text>Тип: {product.type}</Card.Text>
            <Card.Text>Матеріал рами: {product.frameMaterial}</Card.Text>
            <Card.Text>Ціна: {product.price}</Card.Text>
            <Link className="btn btn-info" to={`/shop`}>
              Назад
            </Link>
            <input
              className="float-right btn btn-primary"
              name={props.match.params.id}
              type="button"
              value="Купити"
              onClick={buy}
            />
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ProdDetals;
