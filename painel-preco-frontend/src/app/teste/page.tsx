import { auth } from "auth";
import React from "react";
import { logoutAction } from "../action/logoutActions";

const page = async () => {
  const session = await auth();
  if (!session || !session.userInfo) {
    return <div className="text-red-500 p-5">You Need To Sign In</div>;
  }

  return (
    <div>
      Página de teste para testar autenticação
      <form action={logoutAction}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
};

export default page;