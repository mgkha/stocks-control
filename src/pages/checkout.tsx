import { useEffect, useState } from "react";
import styles from "styles/checkout.module.scss";
import { useRouter } from "next/router";
import IProduct from "types/product";

export default function Checkout() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    let data: IProduct[] = JSON.parse(
      window.localStorage.getItem("products") || "[]"
    );

    if (data && data.length != 0) {
      let filtered = data.reduce((acc: IProduct[], curr: IProduct) => {
        const i = acc.findIndex((p) => p.productName === curr.productName);
        if (i > -1) {
          acc[i] = {
            ...acc[i],
            productQty: +acc[i].productQty + +curr.productQty,
          };
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);

      setProducts(filtered);
    } else {
      router.push("/");
    }
  }, []);

  return (
    <div className="container">
      <main className="main">
        <div className={styles.tableWrapper}>
          <table className={styles.tableCheckout}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products.map((value, key) => (
                  <tr key={key}>
                    <td>{value.productName}</td>
                    <td>{value.productQty}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className={styles.summary}>
          <span>Total Product:</span>
          <span>
            {products.reduce((prev, curr) => +prev + +curr.productQty, 0)}
          </span>
        </div>

        <textarea
          className={styles.description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <div className={styles.actions}>
          <button onClick={() => router.back()}>Back</button>
          <button
            className={styles.btnSubmit}
            onClick={() => {
              console.log(products);
            }}
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  );
}