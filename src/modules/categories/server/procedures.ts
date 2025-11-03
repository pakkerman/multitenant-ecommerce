import { Category } from "@/payload-types";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { CustomCategory } from "@/app/(app)/(home)/types";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "categories",
      depth: 1,
      pagination: false,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    });

    const formattedData: CustomCategory[] = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        // 'depth: 1' ensures that the doc type will be "Category"
        // automatically infer is not present in payload version 3.61
        // issue: https://github.com/payloadcms/payload/pull/9782
        ...(doc as Category),
      })),
    }));

    return formattedData;
  }),
});
