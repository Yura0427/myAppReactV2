import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Basket from "../basket/Basket";
import basketCard from "../../assets/img/basket-cart-main.png";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../../redux/category-reducer";
import style from "./Navbar.module.scss";

export default function NavbarComponent() {
  const { currentUser } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();

  const { orders } = useSelector(({ category }) => {
    return {
      orders: category.orders,
    };
  });

  React.useEffect(() => {
    let arr;
    if (!localStorage.getItem("session_json")) arr = [];
    else arr = JSON.parse(localStorage.getItem("session_json")).purchases;
    dispatch(setOrders(arr))
  }, []);

  return (
    <Navbar bg="light" variant="light" expand="sm" expanded={expanded}>
      <Navbar.Brand as={Link} to="/">
        Navbar
      </Navbar.Brand>

      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        onClick={() =>
          setExpanded((prevExpanded) => (prevExpanded = !prevExpanded))
        }
      />
      <Navbar.Collapse
        id="basic-navbar-nav"
        onClick={() =>
          setExpanded((prevExpanded) => (prevExpanded = !prevExpanded))
        }
      >
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/shop">
            Shop
          </Nav.Link>
          <Nav.Link as={Link} to="/aboutMe">
            AboutMe
          </Nav.Link>
          <Nav.Link as={Link} to="/admin">
            Admin
          </Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link as={Link} to="/user">
            {currentUser ? "Profile" : "Log In"}
          </Nav.Link>
          <a onClick={() => setModalShow(true)} className={style.basket}>
            <img src={basketCard} style={{ height: "35px", margin: "5px" }} />
            {orders.length > 0 && <b className={style.basketItems}>{orders.length}</b>}
          </a>
          <Basket
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
