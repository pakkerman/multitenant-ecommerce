// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor, UploadFeature } from "@payloadcms/richtext-lexical";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import path from "path";
import { buildConfig, Config } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { isSuperAdmin } from "./lib/access";
import { Users } from "./collections/Users";
import { Tenants } from "./collections/Tenants";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Products } from "./collections/Products";
import { Tags } from "./collections/Tags";
import { Orders } from "./collections/Orders";
import { Reviews } from "./collections/Reviews";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeNavLinks: ["@/components/stripe-verify#StripeVerify"],
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Tags,
    Tenants,
    Orders,
    Reviews,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin<Config>({
      collections: {
        products: {},
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
    // storage-adapter-placeholder
  ],
});
