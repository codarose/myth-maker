import styles from "./index.module.css";
import Head from "next/head";
import { useContext } from "react";
import { StoryContext } from "./context/Context";
import { useRouter } from "next/router";
import Link from "next/link";

export default function DisplayStory() {
  //   const { result, loading } = useContext(StoryContext);
  const router = useRouter();
  const { result } = router.query;
  return (
    <div>
      <Head>
        <title>Myth Maker</title>
        <link rel="icon" href="/wizardicon.png" />
        <link rel="stylesheet" href="/reset.css" />
      </Head>
      <main>
        <h3>Generating A Unique Story Just For You...</h3>
        <div
          className={styles.result}
          dangerouslySetInnerHTML={{ __html: result }}
        />
        <div>{result}</div>

        <Link href="/">
          <button>Go Back</button>
        </Link>
      </main>
    </div>
  );
}

DisplayStory.getInitialProps = async (ctx) => {
  const { result } = ctx.query;
  return { result };
};
