import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
};

export default withPayload(nextConfig);
