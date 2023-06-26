import Head from "next/head";
import RegistrationPage from "./registration";

export default function Home() {
  return (
    <>
      <Head>
        <title>Спокуха</title>
        <meta name="description" content="Спокухаj" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <RegistrationPage />
      </main>
    </>
  );
}
