import logo from "./../../assets/logo/cpccu.png";
import google from "./../../assets/logo/search.png";
import login from "./../../assets/img/login.svg";

export default function Login() {
  return (
    <div className="width padding-x ">
      <div className="flex h-screen items-center justify-center ">
        <section className="lg:w-1/2 relative -top-14  md:top-0">
          <div className="lg:max-w-[23.5rem] xxl:max-w-[25rem] mx-auto flex flex-col gap-5 xxl:gap-7">
            {/* welcome part */}
            <header className="flex flex-col items-start gap-5 xxl:gap-8">
              <img className="h-14 xxl:h-16" src={logo} alt="cpccu_logo" />
              <div>
                <h3 className="text-3xl xxl:text-3xl font-bold">
                  Welcome back!
                </h3>
                <h1 className="opacity-70 xxl:text-lg">
                  Competitive Programming Camp City University
                </h1>
              </div>
            </header>

            {/* sign in form */}
            <main className="">
              <div className="flex flex-col gap-1">
                <label className="font-semibold" htmlFor="username">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  className="input"
                  type="email"
                  id="username"
                  placeholder="Enter your email"
                />
              </div>

              <div className="flex flex-col gap-1 mt-4">
                <label className="font-semibold" htmlFor="username">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  className="input"
                  type="password"
                  id="password"
                  placeholder="Enter password"
                />
              </div>

              <div className="flex justify-between mt-3 mb-6">
                <div className="flex gap-1 items-center justify-center">
                  <input
                    className="mt-[.5px]"
                    type="checkbox"
                    name=""
                    id="showPassword"
                  />
                  <label className="text-sm opacity-60" htmlFor="showPassword">
                    show password
                  </label>
                </div>

                <p className="cursor-pointer hover:underline text-right text-login text-sm">
                  Forgot your password?
                </p>
              </div>

              <button className="input w-full bg-login text-white font-semibold">
                Login
              </button>

              <p className="text-center my-7 xl:my-6 xxl:my-8 or relative opacity-50">
                or, Login with
              </p>

              <button className="input w-full">
                <div className="flex text-center gap-2 items-center justify-center">
                  <img className="h-5 mt-1" src={google} alt="google" />
                  <p className="font-semibold">sign in with google</p>
                </div>
              </button>

              <p className="text-center mt-4 ">
                <span className="text-sm opacity-80">
                  Don't have an account?{" "}
                </span>
                <span className="text-login underline font-semibold cursor-pointer">
                  Register here
                </span>
              </p>
            </main>
          </div>
        </section>
        <section className="w-1/2 hidden md:block">
          <img className="h-full w-full object-cover" src={login} alt="" />
        </section>
      </div>
    </div>
  );
}
