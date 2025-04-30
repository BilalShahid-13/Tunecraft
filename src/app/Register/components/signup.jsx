'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'

export default function SignUp() {
  return (
    <SignUp.Root>
      <SignUp.Step name="start">
        <h1>Create an account</h1>

        {/* <Clerk.Connection name="google">Sign up with Google</Clerk.Connection> */}

        <Clerk.Field name="username">
          <Clerk.Label>Username</Clerk.Label>
          <Clerk.Input />
          <Clerk.FieldError />
        </Clerk.Field>

        <Clerk.Field name="emailAddress">
          <Clerk.Label>Email</Clerk.Label>
          <Clerk.Input />
          <Clerk.FieldError />
        </Clerk.Field>

        <Clerk.Field name="password">
          <Clerk.Label>Password</Clerk.Label>
          <Clerk.Input />
          <Clerk.FieldError />
        </Clerk.Field>

        <SignUp.Captcha />

        <SignUp.Action submit={(e) => console.log(e)}>Sign up</SignUp.Action>
      </SignUp.Step>

      <SignUp.Step name="verifications">
        <SignUp.Strategy name="email_code">
          <Clerk.Field name="code">
            <Clerk.Label>Email code</Clerk.Label>
            <Clerk.Input />
            <Clerk.FieldError />
          </Clerk.Field>

          <SignUp.Action submit>Verify email</SignUp.Action>
        </SignUp.Strategy>
      </SignUp.Step>
    </SignUp.Root>
  )
}