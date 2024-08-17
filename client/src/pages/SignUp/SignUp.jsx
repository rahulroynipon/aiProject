import React, { useEffect } from "react";
import loginImage from "./../../assets/img/login.svg";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { MdLockReset } from "react-icons/md";
import { useRenewPass } from "../../hooks/useRenewPass";
import resetIMG from "./../../assets/img/reset.png";
import OrPartition from "../../components/OrPartition";

// label={"Fullname"}
// id="password"
// type={isShowPass ? "text" : "password"}
// value={password}
// onChange={(e) => setPassword(e.target.value)}
// placeholder="Type new password"
// disabled={isLoading || isPending}

const inputFieldInfo = [
  {
    label: "Fullname",
    id: "fullname",
    type: "text",
    placeholder: "Enter your fullname",
  },
  {
    label: "Fullname",
    id: "fullname",
    type: "text",
    placeholder: "Enter your fullname",
  },
];

export default function RenewPass() {
  return (
    <div className="width padding-x">
      <div className="flex h-screen items-center justify-center">
        <img
          className="max-h-[25rem] object-center  hidden lg:block"
          src={resetIMG}
          alt="reset_password_image"
        />

        <section className="lg:w-1/2">
          <div className="lg:max-w-[23.5rem] xxl:max-w-[25rem] mx-auto flex flex-col p-5 md:border md:rounded-xl md:shadow-xl md:shadow-login/20">
            <div className="flex items-center justify-center">
              <div className="text-white bg-login rounded-full p-1">
                <MdLockReset size={45} />
              </div>
            </div>

            <header className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold opacity-70">Sign Up</h1>
              <div>
                <h1 className="opacity-70 xxl:text-lg text-center">
                  Competitive Programming Camp City University
                </h1>
              </div>
            </header>

            <OrPartition clName={"my-2"} text={"or"} />

            <main className="flex flex-col gap-5">
              <form className="flex flex-col gap-3 xxl:gap-5">
                <InputField required />

                <InputField required />

                <div className="flex items-center justify-end mt-5 gap-3">
                  <Button clName={"input bg-login text-white"}>Back</Button>
                  <Button clName={"input bg-login text-white"}>Next</Button>
                </div>
              </form>
            </main>
          </div>
        </section>
      </div>
    </div>
  );
}
