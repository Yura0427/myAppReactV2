import React, { useEffect, useState } from "react";
import { Accordion, Card, Nav, ListGroup, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";

import {
  fetchProducts,
  fetchBrend,
  fetchType,
  fetchFrameMaterial,
} from "../../redux/category-reducer";
import { filterByMinMax, filterByObjKey } from "../../shared/filters";
import { Preloader } from "../preloader/Preloader";
import style from "./Shop.module.scss";



export default function Shop() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [sortTarget, setSortTarget] = useState(null);
  const [filterBrendArr, setFilterBrendArr] = useState([]);
  const [filterTypeArr, setFilterTypeArr] = useState([]);
  const [filterFrameArr, setFilterFrameArr] = useState([]);


  useEffect(() => {
    const promises = [];
    promises.push(dispatch(fetchProducts(sortTarget)));
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
  }, [sortTarget]);

  const { products, brend, type, frameMaterial, minPrice, maxPrice } =
    useSelector(({ category }) => {
      return {
        products: category.products,
        brend: category.brend,
        type: category.type,
        frameMaterial: category.frameMaterial,
        minPrice: category.minPrice,
        maxPrice: category.maxPrice,
      };
    });
  const [sortName, setSortName] = useState("Сортувати за...");
  const setSort = (e) => {
    setSortName(e.target.textContent);
    if (e.target.id === "priceUp") {
      setSortTarget("asc");
    }
    if (e.target.id === "priceDn") {
      setSortTarget("desc");
    }
    if (e.target.id === "new") {
      setSortTarget("new");
    }
  };

  const [valuePrice, setValuePrice] = useState([minPrice, maxPrice]);
  useEffect(() => {
    setValuePrice([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const addFilterBrend = (e) => {
    if (e.target.checked === true) {
      setFilterBrendArr((prev) => [...prev, e.target.name]);
    }
    if (e.target.checked === false) {
      setFilterBrendArr(filterBrendArr.filter((arr) => arr !== e.target.name));
    }
  };
  const addFilterType = (e) => {
    if (e.target.checked === true) {
      setFilterTypeArr((prev) => [...prev, e.target.name]);
    }
    if (e.target.checked === false) {
      setFilterTypeArr(filterTypeArr.filter((arr) => arr !== e.target.name));
    }
  };
  const addFilterFrame = (e) => {
    if (e.target.checked === true) {
      setFilterFrameArr((prev) => [...prev, e.target.name]);
    }
    if (e.target.checked === false) {
      setFilterFrameArr(filterFrameArr.filter((arr) => arr !== e.target.name));
    }
  };

  return (
    <div className={style.container}>
      <div className={style.fill}>
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Nav.Link} eventKey="0">
              Brend
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                {brend &&
                  brend.map((p) => {
                    return (
                      <div key={p}>
                        <label>
                          <input
                            name={p}
                            className="m-2"
                            type="checkbox"
                            onChange={addFilterBrend}
                          />
                          <span className="m-2">{p}</span>
                        </label>
                      </div>
                    );
                  })}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Nav.Link} eventKey="0">
              Price :
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Range
                  value={valuePrice}
                  onChange={(e) => {
                    setValuePrice(e);
                  }}
                  min={minPrice}
                  max={maxPrice}
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{valuePrice[0]}</span>
                  <span>
                    {valuePrice[1]} <b>₴</b>
                  </span>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Nav.Link} eventKey="0">
              Type
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                {type &&
                  type.map((p) => {
                    return (
                      <div key={p}>
                        <label>
                          <input
                            name={p}
                            className="m-2"
                            type="checkbox"
                            onChange={addFilterType}
                          />
                          <span className="m-2">{p}</span>
                        </label>
                      </div>
                    );
                  })}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Nav.Link} eventKey="0">
              Frame Material
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                {frameMaterial &&
                  frameMaterial.map((p) => {
                    return (
                      <div key={p}>
                        <label>
                          <input
                            name={p}
                            className="m-2"
                            type="checkbox"
                            onChange={addFilterFrame}
                          />
                          <span className="m-2">{p}</span>
                        </label>
                      </div>
                    );
                  })}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
      <div className={style.body}>
        <div
          style={{
            height: "50px",
            width: "100%",
            textAlign: "end",
            padding: "5px 5%",
            display: 'flex',
            justifyContent:'flex-end'
          }}
        >
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {sortName}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={setSort} id="priceUp">
                Від дешевих до дорогих
              </Dropdown.Item>
              <Dropdown.Item onClick={setSort} id="priceDn">
                Від дорогих до дешевих
              </Dropdown.Item>
              <Dropdown.Item onClick={setSort} id="new">
                Новинки
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>


        </div>
        <div className={style.items}>
          {isLoading ? (
            <Preloader />
          ) : (
            filterByObjKey(
              filterByObjKey(
                filterByObjKey(
                  filterByMinMax(products, valuePrice[0], valuePrice[1]),
                  filterBrendArr
                ),
                filterTypeArr
              ),
              filterFrameArr
            ).map((item) => {
              return (
                
                <Card key={item.id} border="primary" className={style.card}>
                  <Card.Img variant="top" src={item.productImage} />
                  <Card.Body>
                    <Card.Text>Бренд:{item.brendName}</Card.Text>
                    <Card.Text>Тип: {item.type}</Card.Text>
                    <Card.Text>Frame Material: {item.frameMaterial}</Card.Text>
                    <Card.Text>Price: {item.price}</Card.Text>
                    <Link className="btn btn-sm btn-info" to={`/shop/${item.id}`} >Детальніше...</Link>
                  </Card.Body>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
