import { usePurchaseLink } from "@/lib/get-purchase-link";
import getSdk from "@/lib/get-user-sdk/pages";
import findProduct from "@/lib/has-product";
import ServerSDK from "@/lib/sdk";
import { Membership, Plan, Product } from "@whop-sdk/core";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useEffect, useRef } from "react";
const inter = Inter({ subsets: ["latin"] });
import toast, { Toaster } from 'react-hot-toast';
/**
 * a list of product IDs that are allowed to view this page
 */
const ALLOWED_PRODUCT: string = process.env.NEXT_PUBLIC_REQUIRED_PRODUCT || "";
/**
 * a plan that is recommended to buy if the user does not
 * own a required product
 */
const RECOMMENDED_PLAN = process.env.NEXT_PUBLIC_RECOMMENDED_PLAN_ID || "";

type ProductGatedProps =
  | {
      membership: Membership;
      product: null;
      plan: null;
    }
  | {
      membership: null;
      product: Product;
      plan: Plan;
    };

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


const Page: NextPage<ProductGatedProps> = ({ membership, product, plan }) => {
  const link = usePurchaseLink(RECOMMENDED_PLAN);
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

  if (!membership) {
    return (
      <>
        <Head>
          <title>Skylight AI powered application</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/skylightlogo.svg" />
        </Head>
        <main className={styles.main}>
          <div className={styles.description}>
            <Link
              href="/"
              className={styles.card}
            >
              <span>&lt;-</span> Go back
            </Link>
            <p>
              Edit this page inside of{" "}
              <code className={styles.code}>pages/ssr/product-gated.tsx</code>
            </p>
          </div>

          <div className={styles.center}>
            <div className={styles.otherbox}>
              <h1
                className={inter.className}
                style={{
                  paddingLeft: "5px",
                }}
              >
                Get <Link href={link}>Access</Link> ✨
              </h1>
              <div>
                <p
                  className={inter.className}
                  style={{
                    paddingTop: "20px",
                    paddingLeft: "5px",
                  }}
                >
                  This page is shown to a user who is signed in but does not
                  currently own a Product.
                </p>

                <p style={{ textAlign: "center" }} className={styles.card}>
                  Required product to own:{" "}
                  <code>{JSON.stringify(product, null, "\t")}</code>
                </p>

                <p style={{ textAlign: "center" }} className={styles.card}>
                  Reccomended pricing plan:{" "}
                  <code>{JSON.stringify(plan, null, "\t")}</code>
                </p>

                <p style={{ textAlign: "center" }} className={styles.card}>
                  User has membership: No
                </p>
              </div>
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
            <Link href={link} className={styles.card}>
              <h2 className={inter.className}>Get Access &rarr; </h2>
              <p className={inter.className}>
                Get access to your product.
              </p>
            </Link>
          </div>
        </main>
      </>
    );
  } else {
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
                href="/app/ssr"
                className={styles.card}
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
                <h1 className={inter.className}>Access Granted 🚀 (SSR)</h1>
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
                <p className={inter.className}>
                  Manage your billing and access.
                </p>
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
  }
};

export default Page;

/**
 * This first makes sure the user is logged in, redirecting them if they are not
 * and then checks if the user owns a membership specified in the ALLOWED_PRODUCTES
 * array.
 */
export const getServerSideProps: GetServerSideProps<
  ProductGatedProps
> = async ({ req, res }) => {
  const { sdk } = await getSdk(req, res);
  if (!sdk)
    return {
      redirect: {
        destination: "/ssr",
        permanent: false,
      },
    };
  const membership = await findProduct(sdk, ALLOWED_PRODUCT);
  if (membership)
    return {
      props: {
        membership,
        product: null,
        plan: null,
      },
    };
  else {
    const [product, plan] = await Promise.all([
      ServerSDK.products.retrieveProduct({
        id: ALLOWED_PRODUCT,
      }),
      ServerSDK.plans.retrievePlan({
        id: RECOMMENDED_PLAN,
      }),
    ]);
    return {
      props: {
        membership: null,
        product,
        plan,
      },
    };
  }
};
