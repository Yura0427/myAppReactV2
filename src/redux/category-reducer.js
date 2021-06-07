import { firestore } from "../firebase";

export const SET_PROUCTS = "SET_PROUCTS";
export const SET_ORDERS = "SET_ORDERS";
export const SET_BREND = "SET_BREND";
export const SET_TYPE = "SET_TYPE";
export const SET_FRAME_MATERIAL = "SET_FRAME_MATERIAL";
export const SET_MIN_PRICE = "SET_MIN_PRICE";
export const SET_MAX_PRICE = "SET_MAX_PRICE";

let initialState = {
  products: [],
  orders: [],
  brend: [],
  type: [],
  frameMaterial: [],
  minPrice: null,
  maxPrice: null,
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case SET_ORDERS:
      return {
        ...state,
        orders: action.payload,
      };
    case SET_MIN_PRICE:
      return {
        ...state,
        minPrice: action.payload,
      };
    case SET_MAX_PRICE:
      return {
        ...state,
        maxPrice: action.payload,
      };
    case SET_BREND:
      return {
        ...state,
        brend: action.payload,
      };
    case SET_TYPE:
      return {
        ...state,
        type: action.payload,
      };
    case SET_FRAME_MATERIAL:
      return {
        ...state,
        frameMaterial: action.payload,
      };
    default:
      return state;
  }
};

export const setProducts = (items) => ({ type: SET_PROUCTS, payload: items });
export const setOrders = (items) => ({ type: SET_ORDERS, payload: items });
export const setMinPrice = (items) => ({ type: SET_MIN_PRICE, payload: items });
export const setMaxPrice = (items) => ({ type: SET_MAX_PRICE, payload: items });
export const setBrend = (items) => ({ type: SET_BREND, payload: items });
export const setType = (items) => ({ type: SET_TYPE, payload: items });
export const setFrameMaterial = (items) => ({ type: SET_FRAME_MATERIAL, payload: items});

export const fetchProducts = (sortTarget) => (dispatch) => {
  if (sortTarget === "asc" || sortTarget === "desc") {
    return (
      firestore
        .collection("product")
        .orderBy("price", sortTarget)
        // .onSnapshot((snapshot) => {
        //   const productsData = [];
        //   snapshot.forEach((doc) => productsData.push({ ...doc.data(), id: doc.id }));
        .get()
        .then((doc) => {
          const productsData = [];
          doc.forEach((doc) =>
            productsData.push({ ...doc.data(), id: doc.id })
          );
          dispatch(setProducts(productsData));
        })
    );
  } else if (sortTarget === "new") {
    return firestore
      .collection("product")
      .orderBy("dateAdd", "desc")
      .get()
      .then((doc) => {
        const productsData = [];
        doc.forEach((doc) => productsData.push({ ...doc.data(), id: doc.id }));
        dispatch(setProducts(productsData));
      });
  } else {
    return firestore
      .collection("product")
      .get()
      .then((doc) => {
        let min = 99999,
          max = 0;
        const productsData = [];
        doc.forEach((doc) => productsData.push({ ...doc.data(), id: doc.id }));
        for (let i = 0; i < productsData.length; i++) {
          if (productsData[i].price > max) max = productsData[i].price;
          if (productsData[i].price < min) min = productsData[i].price;
        }
        dispatch(setProducts(productsData));
        dispatch(setMinPrice(min));
        dispatch(setMaxPrice(max));
      });
  }
};

export const fetchBrend = () => (dispatch) => {
  return firestore
    .collection("productCategory")
    .doc("brendName")
    .get()
    .then((doc) => {
      const arr = [];
      for (let index = 0; index < doc.data().brendName.length; index++)
        arr.push(doc.data().brendName[index]);
      dispatch(setBrend(arr));
    });
};
export const fetchType = () => (dispatch) => {
  return firestore
    .collection("productCategory")
    .doc("type")
    .get()
    .then((doc) => {
      const arr = [];
      for (let index = 0; index < doc.data().type.length; index++)
        arr.push(doc.data().type[index]);
      dispatch(setType(arr));
    });
};
export const fetchFrameMaterial = () => (dispatch) => {
  return firestore
    .collection("productCategory")
    .doc("frameMaterial")
    .get()
    .then((doc) => {
      const arr = [];
      for (let index = 0; index < doc.data().frameMaterial.length; index++)
        arr.push(doc.data().frameMaterial[index]);
      dispatch(setFrameMaterial(arr));
    });
};
