import Login from "@/pages/v_login"
import Layout from "./v_layout";
import styles from "../../css/login.module.css"
import Cookies from "js-cookie";
import router from "next/router";
import { useEffect } from "react";
import Head from 'next/head'
export default function Index() {
    const token = Cookies.get('user');

    useEffect(() => {
        if (token) {
            router.push("/v_layout")
        }
    })
    return (
        <>
        <Head>
            <link rel="icon" href="/icon_denso.svg" />
            <title>RDMJ</title>
        </Head>
            <Login />
        </>
    )
}