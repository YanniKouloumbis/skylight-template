import getSdk from "@/lib/get-user-sdk/app";
import findProduct from "@/lib/has-product";
import { NextAppPage } from "@/types/app-dir";
import Head from "next/head";
import Image from "next/image";
import styles from "../../../../styles/Home.module.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const ALLOWED_PRODUCT: string = process.env.NEXT_PUBLIC_REQUIRED_PRODUCT || "";

const inter = Inter({ subsets: ["latin"] });

/**
 * The Layout of this level is product-gated, which makes
 * and page child gated without extra configuration.
 */
const Page: NextAppPage = async () => {
  /**
   * get the sdk and membership again here, this is
   * only done to get the data and not to verify the user
   * owns the product. if the user does not own the product this
   * section will never be rendered as the layout already
   * verifies that the product is owned.
   */
  const { sdk } = await getSdk();
  const membership = (await findProduct(sdk!, ALLOWED_PRODUCT))!;
  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.description}>
            <Link
              href="/app/ssr"
              className={styles.card}
              rel="noopener noreferrer"
            >
              <span>&lt;-</span> Go back
            </Link>
            <p>
              Edit this page inside of{" "}
              <code className={styles.code}>app/app/ssr/page.tsx</code>
            </p>
          </div>

          <div className={styles.center}>
            <div className={styles.otherbox}>
              <h1 className={inter.className}>
                Access <Link href="#">Granted 🚀</Link>
              </h1>
              <p className={inter.className}>
                This page is shown to a user who is signed in, and owns your
                required product!
              </p>
            </div>
          </div>
          <div
            className={styles.grid}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link
              href={
                "https://skylightai.io/hub/" +
                membership.id +
                "?utm_source=nextjs-template"
              }
              className={styles.card}
            >
              <h2 className={inter.className}>Customer Portal &rarr;</h2>
              <p className={inter.className}>Manage your billing and access.</p>
            </Link>

            <Link
              href={
                "https://skylightai.io/hub/" +
                membership.id +
                "?utm_source=nextjs-template"
              }
              className={styles.card}
            >
              <h2 className={inter.className}>Leave a review &rarr;</h2>
              <p className={inter.className}>
                If you like this web app, leave a review!
              </p>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default Page;
