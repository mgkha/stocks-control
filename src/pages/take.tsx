import styles from "styles/take.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAvaiableStocks } from "services/stock";
import Product from "components/Product";
import IProduct from "types/product";
import { useLoading } from "hooks/loading";

export default function Take() {
  const defaultProduct: IProduct = { productName: "", productQty: 1 };
  const [products, setProducts] = useState<IProduct[]>([{ ...defaultProduct }]);
  const [stockList, setStockList] = useState<string[]>([]);
  const [, setLoading] = useLoading();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getAvaiableStocks().then((res) => {
      setStockList(res);
      setLoading(false);
    });

    let data: IProduct[] = JSON.parse(
      window.localStorage.getItem("products") || "[]"
    );
    if (data && data.length != 0) {
      setProducts(data);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  return (
    <div className="container">
      <main className="main">
        {products.map((value, key) => (
          <Product
            key={key}
            index={key + 1}
            product={value}
            stockList={stockList}
            onRemoveProduct={() => {
              products.splice(key, 1);
              setProducts([...products]);
            }}
            onChangeProductName={(e) => {
              products[key].productName = e.target.value;
              setProducts([...products]);
            }}
            onChangeProductQty={(e) => {
              products[key].productQty = parseInt(e.target.value);
              setProducts([...products]);
            }}
          ></Product>
        ))}

        <button
          className={styles.addProduct}
          onClick={() => setProducts([...products, { ...defaultProduct }])}
        >
          Add Product
        </button>

        <button
          className={styles.checkOut}
          onClick={() => {
            if (
              products.length < 1 ||
              products.find((p) => !p.productName || !p.productQty)
            ) {
              alert("Please fill the products.");
            } else {
              router.push("/checkout");
            }
          }}
        >
          Check out
        </button>
      </main>
    </div>
  );
}
