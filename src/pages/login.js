import LoginForm from "../components/LoginForm";
import Link from "next/link";

const LoginPage = () => {
  return (
    <>
      <h1>Авторизация</h1>
      <LoginForm />
      <p>
        У вас нет аккаунта? <Link href="/registration">Зарегистрироваться</Link>
      </p>
    </>
  );
};

export default LoginPage;
