import { NextAppPage } from "@/types/app-dir";
import Head from "next/head";
import styles from "../../../../styles/Home.module.css";
import { Inter } from "next/font/google";
import Link from "next/link";

export const metadata = {
  title: "Skylight AI Powered Application (SSG)",
  icons: {
    icon: [{ url: "/skylightlogo.svg" }, new URL("/skylightlogo.svg", "https://skylightai.io")],
  },
};

const inter = Inter({ subsets: ["latin"] });

/**
 * this page is protected by the middleware, so if
 * no ssg-bailouts are used in here this page will
 * be statically served
 */
const Page: NextAppPage = () => {
  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.description}>
            <Link
              href="/app/ssr"
              className={styles.card}
            >
              <span>&lt;-</span> Go back
            </Link>
            <p>
              Edit this page inside of{" "}
              <code className={styles.code}>
                app/app/ssg/product-gated/page.tsx
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

export default Page;
