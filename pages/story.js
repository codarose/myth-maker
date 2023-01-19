import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [age, setAge] = useState("5 years");
  const [length, setLength] = useState("500");
  const [theme, setTheme] = useState("Friendship");
  const [storyseed, setStoryseed] = useState(
    "Tell me a story about a random animal in a random setting"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: age,
          length: length,
          theme: theme,
          storyseed: storyseed,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result.replaceAll("\n", "<br />"));
      setLoading(false);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert("Failed to generate your story, please try again!");
      //   alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>Myth Maker</title>
        <link rel="icon" href="/wizardicon.png" />
      </Head>

      <main className={styles.main}>
        <img src="/wizardicon.png" className={styles.icon} />
        <h3>What is Your Story?</h3>
        <form onSubmit={onSubmit}>
          <label>Age: </label>
          <input
            type="text"
            name="age"
            placeholder="How Old Are You?"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <label>Choose a Story length under 1000 words: </label>
          <input
            type="number"
            name="length"
            placeholder="500 words is average"
            value={length}
            onChange={(e) => setLength(Number.parseInt(e.target.value))}
          />
          <label>Choose a Story Theme, or Type "No Theme": </label>
          <input
            type="text"
            name="theme"
            placeholder="Is this a story about adventure?"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
          <label>
            Describe the Details of Your Story! Character Names, Settings,
            Anything Your Heart Desires.
          </label>
          <input
            type="text"
            name="storyseed"
            placeholder="Is this a story about adventure?"
            value={storyseed}
            onChange={(e) => setStoryseed(e.target.value)}
          />
          <input type="submit" value="Generate Story" />
        </form>
        {loading && (
          <div>
            <h3>Generating A Unique Story Just For You...</h3>
            <img src="/loading.png" classname={styles.loading} />
          </div>
        )}
        {result && (
          <div
            className={styles.result}
            dangerouslySetInnerHTML={{ __html: result }}
          />
        )}
      </main>
    </div>
  );
}
