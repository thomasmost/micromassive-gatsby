import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Simulator from "../components/simulator";
import { Provider } from "react-redux";
import { store } from "../store";

const IndexPage = () => (
  <Provider store={store}>
    <Layout>
      <SEO title="Home" keywords={[`micromassive`, `economics`, `simulator`]} />
      <h1>Micromassive</h1>
      <Simulator />
      {/* <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div> */}
      <Link to="/about/">About</Link>
    </Layout>
  </Provider>
)

export default IndexPage
