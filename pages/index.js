import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [bookInput, setbookInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book: bookInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setbookInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Book Suggestions Just For You</title>
        <link rel="icon" href="/book.png" />
      </Head>

      <main className={styles.main}>
        <img src="/book.png" className={styles.icon} />
        <h3>Book Suggestions Just For You</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="book"
            placeholder="Enter The Book You're Reading Now"
            value={bookInput}
            onChange={(e) => setbookInput(e.target.value)}
          />
          <input type="submit" value="Generate Suggestions" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
