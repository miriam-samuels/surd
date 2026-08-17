import type { Metadata } from "next";
import {
  ArrowRight02Icon,
  ArrowUp02Icon,
  Calendar03Icon,
  Delete02Icon,
  Mail01Icon,
  PlusSignIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { Avatar, AVATAR_SIZES } from "@/components/ui/avatar";
import { AvatarLabel } from "@/components/ui/avatar-label";
import { Badge, BADGE_TONES, BADGE_VARIANTS } from "@/components/ui/badge";
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TONES,
  BUTTON_VARIANTS,
} from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CRYPTO_SYMBOLS, CryptoIcon } from "@/components/ui/crypto-icon";
import { CurrencyInput, InputAction } from "@/components/ui/currency-input";
import { Field } from "@/components/ui/field";
import { Flag } from "@/components/ui/flag";
import { IconButton } from "@/components/ui/icon-button";
import { Input, INPUT_STATES } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { SOCIAL_PROVIDERS, SocialButton } from "@/components/ui/social-button";
import { Switch } from "@/components/ui/switch";
import { AvatarGroupDemo } from "@/components/showcase/avatar-group-demo";
import {
  Section,
  Specimen,
  SpecimenGrid,
} from "@/components/showcase/specimen";

export const metadata: Metadata = {
  title: "Components",
  description: "Live gallery of every shared admin component.",
};

const TEAM = [
  { name: "Ada Lovelace" },
  { name: "Grace Hopper" },
  { name: "Alan Turing" },
  { name: "Katherine Johnson" },
  { name: "Linus Torvalds" },
  { name: "Margaret Hamilton" },
  { name: "Barbara Liskov" },
];

const COUNTRIES = ["NG", "GH", "KE", "ZA", "GB", "US", "DE", "JP"];

const SELECT_OPTIONS = [
  { value: "flexi", label: "Flexi Wallet" },
  { value: "target", label: "Target Savings" },
  { value: "fixed", label: "Fixed Deposit" },
];

export default function ComponentsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <header className="flex flex-col gap-3 pb-8">
        <p className="text-label-sm uppercase text-surd-blue-500">Admin</p>
        <h1 className="text-heading-lg font-extrabold">Component library</h1>
        <p className="max-w-2xl text-paragraph-md text-grey-400">
          Every shared control, with its tones, variants, sizes and states.
          Import from <code className="font-mono">@/components/ui/*</code>.
        </p>
      </header>

      <Section
        title="Button"
        description="Four axes: tone, variant, size, shape. Icons are passed as data via leadingIcon / trailingIcon."
      >
        <SpecimenGrid>
          {BUTTON_TONES.map((tone) => (
            <Specimen key={tone} label={tone}>
              {BUTTON_VARIANTS.map((variant) => (
                <Button
                  key={variant}
                  tone={tone}
                  variant={variant}
                  leadingIcon={PlusSignIcon}
                  trailingIcon={ArrowRight02Icon}
                >
                  Button
                </Button>
              ))}
            </Specimen>
          ))}
          <Specimen label="sizes">
            {BUTTON_SIZES.map((size) => (
              <Button
                key={size}
                tone="primary"
                size={size}
                leadingIcon={PlusSignIcon}
                trailingIcon={ArrowRight02Icon}
              >
                Button
              </Button>
            ))}
          </Specimen>
          <Specimen label="shapes / disabled">
            <Button shape="rounded">Rounded</Button>
            <Button shape="pill">Pill</Button>
            <Button shape="square">Square</Button>
            <Button disabled>Disabled</Button>
          </Specimen>
        </SpecimenGrid>
      </Section>

      <Section title="Icon button" description="Square footprint, label required.">
        <SpecimenGrid>
          {BUTTON_TONES.map((tone) => (
            <Specimen key={tone} label={tone}>
              {BUTTON_VARIANTS.map((variant) => (
                <IconButton
                  key={variant}
                  tone={tone}
                  variant={variant}
                  icon={PlusSignIcon}
                  label={`${tone} ${variant}`}
                />
              ))}
              {BUTTON_SIZES.map((size) => (
                <IconButton
                  key={size}
                  tone={tone}
                  size={size}
                  icon={Delete02Icon}
                  label={`${tone} ${size}`}
                />
              ))}
            </Specimen>
          ))}
        </SpecimenGrid>
      </Section>

      <Section title="Social sign-in">
        <SpecimenGrid>
          <Specimen label="solid">
            {SOCIAL_PROVIDERS.map((provider) => (
              <SocialButton key={provider} provider={provider} />
            ))}
          </Specimen>
          <Specimen label="outline">
            {SOCIAL_PROVIDERS.map((provider) => (
              <SocialButton key={provider} provider={provider} variant="outline" />
            ))}
          </Specimen>
          <Specimen label="icon only">
            {SOCIAL_PROVIDERS.map((provider) => (
              <SocialButton key={provider} provider={provider} iconOnly />
            ))}
          </Specimen>
        </SpecimenGrid>
      </Section>

      <Section
        title="Avatar"
        description="Photo, initials or the fallback glyph, with an optional corner indicator."
      >
        <SpecimenGrid>
          <Specimen label="sizes — glyph / initials">
            {AVATAR_SIZES.map((size) => (
              <Avatar key={size} size={size} />
            ))}
            {AVATAR_SIZES.map((size) => (
              <Avatar key={size} size={size} name="Sam Lee" />
            ))}
          </Specimen>
          <Specimen label="indicators">
            <Avatar size="xl" name="Sam Lee" indicator={{ type: "dot" }} />
            <Avatar
              size="xl"
              name="Sam Lee"
              indicator={{ type: "dot", tone: "warning" }}
            />
            <Avatar
              size="xl"
              name="Sam Lee"
              indicator={{ type: "count", value: 2 }}
            />
            <Avatar size="xl" name="Sam Lee" indicator={{ type: "verified" }} />
            <Avatar
              size="xl"
              name="Sam Lee"
              indicator={{ type: "dot", tone: "primary" }}
            />
          </Specimen>
          <AvatarGroupDemo people={TEAM} />
          <Specimen label="label" className="flex-col items-start gap-4">
            {(["sm", "md", "lg", "xl"] as const).map((size) => (
              <AvatarLabel
                key={size}
                size={size}
                name="X_AE_A-13"
                caption="Product Designer, slothUI"
              />
            ))}
          </Specimen>
        </SpecimenGrid>
      </Section>

      <Section title="Badge">
        <SpecimenGrid>
          {BADGE_TONES.map((tone) => (
            <Specimen key={tone} label={tone}>
              {BADGE_VARIANTS.map((variant) => (
                <Badge
                  key={variant}
                  tone={tone}
                  variant={variant}
                  dot
                  leadingIcon={ArrowUp02Icon}
                  trailingIcon={ArrowRight02Icon}
                >
                  Label
                </Badge>
              ))}
              <Badge tone={tone} variant="soft" disabled>
                Disabled
              </Badge>
            </Specimen>
          ))}
        </SpecimenGrid>
      </Section>

      <Section title="Controls">
        <SpecimenGrid>
          <Specimen label="checkbox">
            <Checkbox defaultChecked />
            <Checkbox />
            <Checkbox checked="indeterminate" />
            <Checkbox shape="square" defaultChecked />
            <Checkbox disabled defaultChecked />
            <Checkbox size="lg" id="cb-label" label="Remember me" />
          </Specimen>
          <Specimen label="radio">
            <RadioGroup defaultValue="flexi" className="flex-row gap-6">
              <RadioGroupItem value="flexi" label="Flexi" />
              <RadioGroupItem value="target" label="Target" />
              <RadioGroupItem value="fixed" label="Fixed" disabled />
            </RadioGroup>
          </Specimen>
          <Specimen label="switch">
            <Switch size="sm" />
            <Switch defaultChecked />
            <Switch size="lg" defaultChecked />
            <Switch withIcons defaultChecked />
            <Switch withIcons />
            <Switch disabled defaultChecked />
            <Switch id="sw-label" label="Live mode" />
          </Specimen>
        </SpecimenGrid>
      </Section>

      <Section
        title="Inputs"
        description="Every field shares one shell, so surface, height and focus behaviour stay identical. Hover and focus are CSS states; only default / error / active are props."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INPUT_STATES.map((state) => (
            <Field key={state} label={`Text — ${state}`} htmlFor={`text-${state}`}>
              <Input
                id={`text-${state}`}
                state={state}
                leadingIcon={UserIcon}
                placeholder="example@gmail.com"
              />
            </Field>
          ))}
          <Field label="Text — disabled" htmlFor="text-disabled">
            <Input id="text-disabled" disabled placeholder="example@gmail.com" />
          </Field>
          <Field label="Select" htmlFor="select">
            <Select id="select" options={SELECT_OPTIONS} defaultValue="flexi" />
          </Field>
          <Field label="Number" htmlFor="number">
            <NumberInput id="number" defaultValue={0} />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <PhoneInput id="phone" placeholder="90 3276 1840" />
          </Field>
          <Field label="Date" htmlFor="date">
            <Input
              id="date"
              placeholder="dd/mm/yyyy"
              trailingIcon={Calendar03Icon}
            />
          </Field>
          <Field label="URL" htmlFor="url">
            <Input
              id="url"
              placeholder="google.com"
              leading={
                <span className="shrink-0 text-sm text-grey-300">https://</span>
              }
            />
          </Field>
          <Field label="Currency" htmlFor="currency">
            <CurrencyInput id="currency" defaultValue="100.00" />
          </Field>
          <Field label="Action" htmlFor="otp">
            <Input
              id="otp"
              placeholder="100.00"
              trailing={<InputAction>Get OTP</InputAction>}
            />
          </Field>
          <Field
            label="Error with message"
            htmlFor="error"
            error="Enter a valid email address"
          >
            <Input
              id="error"
              state="error"
              leadingIcon={Mail01Icon}
              defaultValue="example@gmail"
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Flags"
        description="ISO 3166-1 alpha-2 codes, served from /flags as static SVG."
      >
        <SpecimenGrid>
          <Specimen label="rect">
            {COUNTRIES.map((code) => (
              <Flag key={code} code={code} size="lg" />
            ))}
          </Specimen>
          <Specimen label="circle">
            {COUNTRIES.map((code) => (
              <Flag key={code} code={code} size="lg" shape="circle" />
            ))}
          </Specimen>
        </SpecimenGrid>
      </Section>

      <Section
        title="Crypto icons"
        description="Curated registry — add a symbol in crypto-icon.tsx to extend it. Not yet checked against the Figma board."
      >
        <Specimen label="tokens">
          {CRYPTO_SYMBOLS.map((symbol) => (
            <CryptoIcon key={symbol} symbol={symbol} size="lg" />
          ))}
        </Specimen>
      </Section>
    </main>
  );
}
