import React from "react";
import Head from "next/head";

const Meta = ({ title, keyword, desc }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.svg" />
        <meta name="description" content={desc} />
        <meta name="keyword" content={keyword} />

        <meta name="theme-color" content="#000000" />

        {/* <!-- Opengraph --> */}
        <meta property="og:title" content="KITSUNE - NFT Marketplace" />
        <meta property="og:description" content="Create An Order To Sell Your NFT. Powered By REI Chain." />
        <meta property="og:image" content="/images/ogimage.png" />
      </Head>
    </div>
  );
};

Meta.defaultProps = {
  title: "KITSUNE | NFT Marketplace",
  keyword:
    "bitcoin, blockchain, crypto, crypto collectibles, crypto makretplace, cryptocurrency, digital items, market, nft, nft marketplace, nft next js, NFT react, non-fungible tokens, virtual asset, wallet",
  desc: "Create An Order To Sell Your NFT. Powered By REI Chain.",
};

export default Meta;
