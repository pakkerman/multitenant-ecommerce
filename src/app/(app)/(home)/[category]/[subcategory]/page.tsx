interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

// funroad.com/[category]/[subcategory]

const Page = async ({ params }: Props) => {
  const { category, subcategory } = await params;

  return (
    <div className="">
      {category}
      <br /> {subcategory}
    </div>
  );
};

export default Page;
