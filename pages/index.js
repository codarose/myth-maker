import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
export default function Home() {
  const [age, setAge] = useState("5 years");
  const [length, setLength] = useState("50");
  const [theme, setTheme] = useState("Friendship");
  const [storyseed, setStoryseed] = useState(
    "Tell me a story about a random animal in a random setting"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [title, setTitle] = useState();

  function handleSave() {
    const key = `${title}-${Date.now()}`;
    localStorage.setItem(key, result);
  }

  function handleTryAgain() {
    window.location.reload();
  }

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

      setResult(data.result.replaceAll(/(\n|:)/g, "<br />"));
      const storyTitle = data.result.match(/"*"\s*(.*?)"/)[0];

      // const storyTitle = data.result.match(/65%23\s*(.*?)"/)[1];
      if (storyTitle) setTitle(storyTitle);

      setLoading(false);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert("Failed to generate your story, please try again!");
      //   alert(error.message);
    } finally {
      setLoading(false);
      console.log("second time: ", result);
    }
  }

  return (
    <div>
      <Head>
        <title>Myth Maker</title>
        <link rel="icon" href="/wizardicon.png" />
        <link rel="stylesheet" href="/reset.css" />
      </Head>
      <div className={styles.appbackground}>
        <main className={styles.main}>
          {!result && !loading && (
            <>
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

                <label>Choose a Story length under 2000 words: </label>
                <input
                  type="number"
                  name="length"
                  placeholder="500 words is typical for young kids"
                  value={length}
                  onChange={(e) => setLength(Number.parseInt(e.target.value))}
                />
                <label>Choose a Story Theme, or Type "No Theme": </label>
                <input
                  type="text"
                  name="theme"
                  placeholder="Adventure? Friendship?"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
                <label>
                  Describe the Details of Your Story! Choose Character Names,
                  Magic, Beautiful Places, Anything Your Heart Desires.
                </label>
                <textarea
                  value={storyseed}
                  placeholder="What wonderful things do you want to read about?"
                  onChange={(e) => setStoryseed(e.target.value)}
                  rows={(e) => {
                    e.target.value.split("\n").length;
                  }}
                />

                {/* <input
      type="text"
      name="storyseed"
      placeholder="What wonderful things do you want to read about?"
      value={storyseed}
      onChange={(e) => setStoryseed(e.target.value)}
    /> */}
                <input type="submit" value="Generate Story" />
              </form>
            </>
          )}
          {loading && (
            <div className={styles.imgcontainer}>
              <h3>Generating A Unique Story Just For You...</h3>
              <img src="/loading.png" className={styles.loading} />
            </div>
          )}
          {result && !loading && (
            <div className={styles.storylogic}>
              <div className={styles.storycontainer}>
                <div className={styles.storyTitle}>{title}</div>
                <div
                  className={styles.result}
                  dangerouslySetInnerHTML={{
                    __html: result.replace(title, ""),
                  }}
                />

                {console.log("title: ", title)}
              </div>
              <div className={styles.buttonContainer}>
                <button className={styles.customButton} onClick={handleSave}>
                  Save {title}
                </button>

                <button
                  className={styles.customButton}
                  onClick={handleTryAgain}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
