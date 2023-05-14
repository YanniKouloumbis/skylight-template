import { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { Inter } from "next/font/google";
import { useEffect, useRef } from "react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const waitForAI = async (): Promise<boolean> => {
  let timeoutCounter = 0;

  while (!(window as any).ai) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    timeoutCounter += 100;

    if (timeoutCounter >= 1000) {
      return false;
    }
  }

  return true;
};
/**
 * this page is gated on a middleware level
 */
const SSGProductGatedPage: NextPage = () => {
  const aiRef = useRef(null);

  useEffect(() => {
    const checkForAI = async () => {
      const aiDetected = await waitForAI();

      if (aiDetected) {
        aiRef.current = (window as any).ai;
        // You can replace this with the toast.success call or any other desired action
        console.log("window.ai detected!");
      } else {
        // You can replace this with the toast.custom call or any other desired action
        console.log(
          `Please visit https://windowai.io to install window.ai`
        );
      }
    };

    checkForAI();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Paywall App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/skylightlogo.svg" />
        </Head>

        <main className={styles.main}>
          <div className={styles.description}>
            <Link
              href="/ssr"
              className={styles.card}
              rel="noopener noreferrer"
            >
              <span>&lt;-</span> Go back
            </Link>
            <p>
              Edit this page inside of{" "}
              <code className={styles.code}>
                pages/ssg/product-gated/page.tsx
              </code>
            </p>
          </div>

          <div className={styles.center}>
            <div className={styles.otherbox}>
              <h1 className={inter.className}>Access Granted 🚀 (SSG)</h1>
              <p className={inter.className}>
                This page is protected by the middleware, so if no SSG bailouts
                are used here, the page will be statically served.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SSGProductGatedPage;
