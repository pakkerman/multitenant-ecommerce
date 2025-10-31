import configPromise from "@payload-config";
import { getPayload } from "payload";

import { Category } from "@/payload-types";

import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilters } from "./search-filters";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1, // Populate subcategories, subcategories[0] will be type "Category"
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // 'depth: 1' ensures that the doc type will be "Category"
      // automatically infer is not present in payload version 3.61
      // issue: https://github.com/payloadcms/payload/pull/9782
      ...(doc as Category),
    })),
  }));

  return (
    <div className="flex flex-col h-[max(100vh,800px)] ">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
