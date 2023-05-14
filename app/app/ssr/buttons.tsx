"use client";

import { signIn, signOut } from "next-auth/react";
import { FunctionComponent } from "react";
import styles from "../../../styles/Home.module.css";
import Link from "next/link";

const Button: FunctionComponent<{
  loggedIn?: boolean;
  children: any;
}> = ({ loggedIn = false, children }) => {
  return (
    <Link
      href="#"
      className={styles.card}
      onClick={() => (loggedIn ? signOut() : signIn("skylightai"))}
    >
      {children}
    </Link>
  );
};

export default Button;
