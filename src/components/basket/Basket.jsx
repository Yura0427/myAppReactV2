import React, { useEffect, useState } from "react";
import { Modal, } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import delItemImg from "../../assets/img/basketCartDel.png";
import { setOrders } from "../../redux/category-reducer";
import style from "./Basket.module.scss";

const Basket = (props) => {
  const [allSum, setAllSum] = useState();
  const dispatch = useDispatch();

  const { orders } = useSelector(({ category }) => {
    return {
      orders: category.orders,
    };
  });

  React.useEffect(() => {
    let s = 0;
    for (let i = 0; i < orders.length; i++) {
      s += orders[i].price * orders[i].quantity;
    }
    setAllSum(s);
  });
  const delPr = (e) => {
    let arr = [];
    orders.map((i) => {
      if (i.id !== e.target.name) arr.push(i);
    });
    localStorage.setItem("session_json", JSON.stringify({ purchases: arr }));
    dispatch(setOrders(arr));
  };
  function updateArray(arr, id, numb) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id && (numb === -1 ? arr[i].quantity > 1 : true))
        arr[i] = { ...arr[i], quantity: arr[i].quantity + numb };
    }
    return arr;
  }
  const increment = (e) => {
    const arr = updateArray(orders, e.target.name, +1);
    localStorage.setItem("session_json", JSON.stringify({ purchases: arr }));
    dispatch(setOrders(arr));
  };
  const decrement = (e) => {
    const arr = updateArray(orders, e.target.name, -1);
    localStorage.setItem("session_json", JSON.stringify({ purchases: arr }));
    dispatch(setOrders(arr));
  };

  return (
    <Modal {...props} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Basket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {orders.length === 0 ? (
            <h4>Кошик порожній</h4>
          ) : (
            orders.map((p) => {
              console.log(p);
              return (
                <div>
                  <div className={style.productBody}>
                    <img src={p.productImage} style={{ height: "200px" }} />
                    <h5>Велосипед {p.brendName}</h5>
                    <button
                      type="button"
                      onClick={delPr}
                      name={p.id}
                      style={{ margin: "auto", height: "50px", width: "50px" }}
                    >
                      <img
                        name={p.id}
                        src={delItemImg}
                        alt=""
                        style={{ margin: "auto", height: "40px" }}
                      />
                      Видалити
                    </button>
                  </div>
                  <p>Ціна: {p.price}</p>
                  <div className={style.productFooter}>
                    <div className={style.productCounter}>
                      <button onClick={decrement} name={p.id}>
                        −
                      </button>
                      <input type="text" name="" disabled value={p.quantity} />
                      <button onClick={increment} name={p.id}>
                        +
                      </button>
                    </div>

                    <b style={{ float: "right" }}>
                      Сума: {p.price * p.quantity} <b>₴</b>
                    </b>
                    <br />
                  </div>
                  <hr />
                </div>
              );
            })
          )}
          <b style={{ float: "right" }}>
            Загалом: {allSum} <b>₴</b>
          </b>
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
export default Basket;
