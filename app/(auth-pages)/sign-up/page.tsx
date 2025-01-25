import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";


export default async function SignUp(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 mb-2">
          Start Your Journey with JourneyAI
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          Begin your path to personal growth and self-discovery
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700">
          <form className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium">
                Email address
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium">
                Password
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password" className="block text-sm font-medium">
                Confirm Password
              </Label>
              <div className="mt-1">
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full"
                />
              </div>
            </div>

            <div>
              <SubmitButton
                formAction={signUpAction}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Account
              </SubmitButton>
            </div>

            <FormMessage message={searchParams} />
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/sign-in"
                className="w-full flex justify-center py-2 px-4 border-2 border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-transparent hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
