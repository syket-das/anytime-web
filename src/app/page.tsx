import Hero from "@/components/home/Hero";
import Related from "@/components/home/Related";
import Content from "@/components/home/Content";
import Feature from "@/components/home/Feature";
import GDPRFeature from "@/components/home/GDPRFeature";
import ValuePropositions from "@/components/home/ValuePropositions";
import Blog from "@/components/home/Blog";
import Header from "@/components/universal/Header";
import Footer from "@/components/universal/Footer";

const title = "AnytimeP2P | Manage Crypto Portfolio";
const description =
  "End-to-end payments and financial management in a single solution. Meet the right platform to help realize.";
const author = "Syket Das";
const keywords =
  "Saas, startup, next.js, react, crypto, wallet, bitcoin, blockchain, landing-page, fin-tech, finance".split(
    ", "
  );
const url = "/";

export const metadata = {
  title,
  description,
  keywords,
  openGraph: {
    title,
    description,
    url,
    siteName: "AnytimeP2P",
    locale: "en-US",
    type: "website",
  },
  twitter: {
    title,
    description,
  },
  alternates: {
    canonical: url,
    languages: {
      "en-US": url,
    },
  },
};

export default function Home() {
  return (
    <>
      <Header />

      <Hero />
      <Related />
      <Content />
      <Feature />
      <GDPRFeature />
      <ValuePropositions />
      <Blog />
      <Footer />
    </>
  );
}
