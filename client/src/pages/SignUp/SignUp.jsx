import InputField from "../../components/InputField";

export default function SignUp() {
  return (
    // email, fullname, batch, password, uniID
    <div className="width padding-x">
      <div className="flex items-center justify-center h-screen">
        <section className="ring lg:w-1/2 hidden lg:block"></section>
        <section className="lg:w-1/2">
          <from>
            <InputField
              label={"Fullname"}
              placeholder={"Enter your fullname"}
              required
            />
            <InputField
              label={"Email"}
              placeholder={"Enter your email"}
              required
            />
            <InputField
              label={"University Id"}
              placeholder={"Enter your university id"}
              required
            />
            <InputField
              label={"Batch No."}
              placeholder={"Enter your batch no."}
              required
            />
            <InputField
              label={"Password"}
              placeholder={"Enter your password"}
              required
            />
          </from>
        </section>
      </div>
    </div>
  );
}
