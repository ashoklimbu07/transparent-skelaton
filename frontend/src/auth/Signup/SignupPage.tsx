import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

type SignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
};

type SignupFormErrors = Partial<Record<keyof SignupFormValues, string>>;

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 10;
const PASSWORD_MIN_LENGTH = 8;

const INITIAL_FORM_VALUES: SignupFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: false,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimFormValues(values: SignupFormValues): SignupFormValues {
  return {
    ...values,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
  };
}

function validateSignupForm(values: SignupFormValues): SignupFormErrors {
  const errors: SignupFormErrors = {};

  if (values.firstName.length < NAME_MIN_LENGTH || values.firstName.length > NAME_MAX_LENGTH) {
    errors.firstName = `First name must be ${NAME_MIN_LENGTH}-${NAME_MAX_LENGTH} characters.`;
  }

  if (values.lastName.length < NAME_MIN_LENGTH || values.lastName.length > NAME_MAX_LENGTH) {
    errors.lastName = `Last name must be ${NAME_MIN_LENGTH}-${NAME_MAX_LENGTH} characters.`;
  }

  if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!values.agreedToTerms) {
    errors.agreedToTerms = 'You must agree to Terms and Privacy Policy.';
  }

  return errors;
}

export function SignupPage() {
  const [formValues, setFormValues] = useState<SignupFormValues>(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = useState<SignupFormErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedValues = trimFormValues(formValues);
    setFormValues(trimmedValues);

    const errors = validateSignupForm(trimmedValues);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // UI-only flow for now; API integration will be added later.
  };

  const inputBaseClass =
    'w-full h-11 bg-[#080808] border px-3 text-sm outline-none focus:border-[#ff3c00]';

  const getInputClassName = (hasError: boolean) =>
    `${inputBaseClass} ${hasError ? 'border-[#ff5a28]' : 'border-[#222222]'}`;

  return (
    <main className="min-h-screen bg-[#080808] text-[#f0ede8] font-['DM_Sans'] flex items-center justify-center px-5 py-10">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap"
      />

      <section className="w-full max-w-lg border border-[#222222] bg-[#111111] p-6 sm:p-7 md:p-8">
        <Link to="/" className="inline-block font-['Bebas_Neue'] text-[30px] tracking-[2px] mb-6">
          Broll<span className="text-[#ff3c00]">AI</span>
        </Link>

        <p className="text-[11px] tracking-[3px] uppercase text-[#ff3c00]">Create Account</p>
        <h1 className="font-['Bebas_Neue'] text-[42px] leading-none tracking-[1px] mt-1 mb-6">Sign Up</h1>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="signup-first-name" className="block text-sm text-[#aaaaaa] mb-1.5">
                <span className="text-[#ff3c00]">*</span> First name
              </label>
              <input
                id="signup-first-name"
                type="text"
                autoComplete="given-name"
                required
                placeholder="First name"
                value={formValues.firstName}
                onChange={(event) => {
                  setFormValues((prev) => ({ ...prev, firstName: event.target.value }));
                  setFormErrors((prev) => ({ ...prev, firstName: undefined }));
                }}
                className={getInputClassName(Boolean(formErrors.firstName))}
              />
              {formErrors.firstName ? <p className="mt-1.5 text-xs text-[#ff5a28]">{formErrors.firstName}</p> : null}
            </div>

            <div>
              <label htmlFor="signup-last-name" className="block text-sm text-[#aaaaaa] mb-1.5">
                Last name
              </label>
              <input
                id="signup-last-name"
                type="text"
                autoComplete="family-name"
                required
                placeholder="Last name"
                value={formValues.lastName}
                onChange={(event) => {
                  setFormValues((prev) => ({ ...prev, lastName: event.target.value }));
                  setFormErrors((prev) => ({ ...prev, lastName: undefined }));
                }}
                className={getInputClassName(Boolean(formErrors.lastName))}
              />
              {formErrors.lastName ? <p className="mt-1.5 text-xs text-[#ff5a28]">{formErrors.lastName}</p> : null}
            </div>
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm text-[#aaaaaa] mb-1.5">
              <span className="text-[#ff3c00]">*</span> Email address
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={formValues.email}
              onChange={(event) => {
                setFormValues((prev) => ({ ...prev, email: event.target.value }));
                setFormErrors((prev) => ({ ...prev, email: undefined }));
              }}
              className={getInputClassName(Boolean(formErrors.email))}
            />
            {formErrors.email ? <p className="mt-1.5 text-xs text-[#ff5a28]">{formErrors.email}</p> : null}
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm text-[#aaaaaa] mb-1.5">
              <span className="text-[#ff3c00]">*</span> Password
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Create a password"
              value={formValues.password}
              onChange={(event) => {
                setFormValues((prev) => ({ ...prev, password: event.target.value }));
                setFormErrors((prev) => ({ ...prev, password: undefined }));
              }}
              className={getInputClassName(Boolean(formErrors.password))}
            />
            {formErrors.password ? <p className="mt-1.5 text-xs text-[#ff5a28]">{formErrors.password}</p> : null}
          </div>

          <div>
            <label htmlFor="signup-confirm-password" className="block text-sm text-[#aaaaaa] mb-1.5">
              Confirm password
            </label>
            <input
              id="signup-confirm-password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Confirm your password"
              value={formValues.confirmPassword}
              onChange={(event) => {
                setFormValues((prev) => ({ ...prev, confirmPassword: event.target.value }));
                setFormErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              className={getInputClassName(Boolean(formErrors.confirmPassword))}
            />
            {formErrors.confirmPassword ? (
              <p className="mt-1.5 text-xs text-[#ff5a28]">{formErrors.confirmPassword}</p>
            ) : null}
          </div>

          <label className="inline-flex items-start gap-2 text-sm text-[#aaaaaa]">
            <input
              type="checkbox"
              required
              checked={formValues.agreedToTerms}
              onChange={(event) => {
                setFormValues((prev) => ({ ...prev, agreedToTerms: event.target.checked }));
                setFormErrors((prev) => ({ ...prev, agreedToTerms: undefined }));
              }}
              className="h-4 w-4 mt-0.5 accent-[#ff3c00]"
            />
            <span>
              I agree to the{' '}
              <button type="button" className="text-[#ff3c00] hover:text-[#ff5a28] transition-colors">
                Terms
              </button>{' '}
              and{' '}
              <button type="button" className="text-[#ff3c00] hover:text-[#ff5a28] transition-colors">
                Privacy Policy
              </button>
              .
            </span>
          </label>
          {formErrors.agreedToTerms ? <p className="text-xs text-[#ff5a28]">{formErrors.agreedToTerms}</p> : null}

          <button
            type="submit"
            className="w-full h-11 bg-[#ff3c00] hover:bg-[#ff5a28] text-white text-sm font-medium uppercase tracking-[.5px] transition-colors"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-sm text-[#888888]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#ff3c00] hover:text-[#ff5a28] transition-colors">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
