export const SignInView = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="h-screen w-full overflow-y-auto bg-[#f4f4f0] lg:col-span-3">
        Form column
      </div>
      <div className="hidden h-screen w-full lg:col-span-2 lg:block">
        background column
      </div>
    </div>
  );
};
