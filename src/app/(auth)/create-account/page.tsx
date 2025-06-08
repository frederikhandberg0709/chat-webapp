import { RegisterForm } from "@/features/auth/RegisterForm";

export default function CreateAccountPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center">Register</h1>

      <RegisterForm />
    </div>
  );
}
