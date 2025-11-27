import { cookies as getCookies } from "next/headers";

interface Props {
  prefix: string;
  value: string;
}

export const generateAuthCookie = async ({ prefix, value }: Props) => {
  console.warn("[node env]", process.env.NODE_ENV);
  const cookies = await getCookies();

  if (process.env.NODE_ENV === "production") {
    cookies.set({
      name: `${prefix}-token`,
      value: value,
      httpOnly: true,
      path: "/",
      sameSite: "none",
      domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
      secure: process.env.NODE_ENV === "production",
    });
  } else if (process.env.NODE_ENV === "development") {
    cookies.set({
      name: `${prefix}-token`,
      value: value,
      httpOnly: true,
      path: "/",
    });
  }
};
