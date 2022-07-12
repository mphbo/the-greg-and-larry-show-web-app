import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {Unity, useUnityContext} from 'react-unity-webgl';

const Home: NextPage = () => {

  const { unityProvider } = useUnityContext({
    loaderUrl: "assets/the-greg-and-larry-show-webgl.loader.js",
    dataUrl: "assets/the-greg-and-larry-show-webgl.data",
    frameworkUrl: "assets/the-greg-and-larry-show-webgl.framework.js",
    codeUrl: "assets/the-greg-and-larry-show-webgl.wasm",
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>The Greg and Larry Show</title>
        <meta name="description" content="Generated by Logan Thomas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div >
        <Unity style={{ height: '100vh', width: '100vw'}}unityProvider={unityProvider} />
      </div>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  )
}

export default Home
