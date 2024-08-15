import { Button, InputField, OrPartition } from "./../../components/component";

export default function SignUp() {
  return (
    <div className="width padding-x">
      <div className="flex h-screen">
        <section className="bg-red-900 h-screen w-1/2"></section>

        {/* start the sing up section */}
        <section className="w-1/2 flex flex-col items-center justify-center">
          <h2>Sign Up</h2>
          <Button clName={"input"}>Sign up with google</Button>

          {/* Form start here */}

          <form action="" className="flex flex-col gap-3">
            <InputField
              id={"fullname"}
              label={"Fullname"}
              placeholder={"Enter your fullname"}
              required
            />
            <InputField
              id={"email"}
              label={"Email"}
              placeholder={"Enter your email"}
              required
            />

            <div className="flex items-center justify-between gap-3 py-3">
              <Button clName={"input w-1/2"}>Back</Button>
              <Button clName={"input w-1/2"}>Next</Button>
            </div>
          </form>
          {/* Form end here */}
        </section>
        {/* end the sing up section */}
      </div>
    </div>
  );
}
