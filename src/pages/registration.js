import RegistrationForm from "../components/RegistrationForm";
import Link from "next/link";

const RegistrationPage = () => {
  return (
    <>
      <h1>Регистрация</h1>
      <RegistrationForm />
      <p>
        У меня уже есть аккаунт, <Link href="/login">Авторизоваться</Link>
      </p>
    </>
  );
};

export default RegistrationPage;
