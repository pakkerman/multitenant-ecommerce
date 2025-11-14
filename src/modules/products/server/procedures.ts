import { headers as getHeaders } from "next/headers";
import z from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category, Media, Tenant } from "@/payload-types";
import { Sort, Where } from "payload";

import { DEFAULT_LIMIT } from "@/constants";
import { sortValues } from "../search-params";

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.db.auth({ headers });

      const product = await ctx.db.findByID({
        collection: "products",
        id: input.id,
        depth: 2, // Load the "prduct.image", "product.tenant", "product.tenant.image"
      });

      let isPurchased = false;
      if (session.user) {
        const ordersData = await ctx.db.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
              },
              {
                user: {
                  equals: session.user.id,
                },
              },
            ],
          },
        });

        isPurchased = ordersData.totalDocs > 0;
      }

      return {
        ...product,
        isPurchased,
        image: (product.image as Media) || null,
        cover: (product.cover as Media) || null,
        tenant: product.tenant as Tenant & { image: Media | null },
      };
    }),

  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort;

      switch (input.sort) {
        case "trending":
          sort = "name";
          break;
        case "hot_and_new":
          sort = "+createdAt";
          break;
        case "curated":
          sort = "-createdAt";
          break;
        default:
          sort = "-createdAt";
      }

      if (input.minPrice || input.maxPrice) {
        where.price = {
          ...(input.minPrice && { greater_than_equal: input.minPrice }),
          ...(input.maxPrice && { less_than_equal: input.maxPrice }),
        };
      }

      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
      }

      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1, // populate subcategories, subcategories.[0] will be type of "Category"
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            // 'depth: 1' ensures that the doc type will be "Category"
            // automatically infer is not present in payload version 3.61
            // issue: https://github.com/payloadcms/payload/pull/9782
            ...(doc as Category),
          })),
        }));

        const subcategoriesSlugs = [];
        const parentCategory = formattedData[0];

        if (parentCategory) {
          subcategoriesSlugs.push(
            ...parentCategory.subcategories.map((item) => item.slug),
          );

          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategoriesSlugs],
          };
        }
      }

      // filter with tags
      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 2, // this will get "image", and "category", "tenant", "tenant.image"
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
