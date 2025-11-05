interface Props {
  params: Promise<{
    category: string;
  }>;
}

// funroad.com/[subcategory]

const Page = async ({ params }: Props) => {
  const { category } = await params;

  return <div className="">{category}</div>;
};

export default Page;
