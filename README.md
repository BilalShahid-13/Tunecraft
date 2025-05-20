This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


<!-- db template -->
{
  "_id": { "$oid": "6824992fc2c247c70e1dc4cf" },
  "email": "atif@gmail.com",
  "username": "atif",
  "role": "singer",
  "musicTemplate": "Love Song",
  "phone": "(+52)1111111111",
  "info": "i want shayari",
  "cv": "https://res.cloudinary.com/dbsxojyxy/raw/upload/v1746804136/Tunecraft/…",
  "password": "$2y$10$9h8pwDMNjiIbVbpAegGtPeQy4FoKuMxNxQerst2941KjzwPLWyVl2",
  "approvalStatus": "rejected"
}



flow:
im working on a project called tunecraft , the working of the project is ,a if  user/orderer order thes the music he/she wants to create so it gives the input and meanwhile the freelancer like the singer,lyricist and wngineer they want to earn money by creating lyrics,or mixing crafters section so they resgister it but the twist is they just send the role,fullname,email,resume,phone number not password now the form is go on mongodb and i creates the admin panel so the admin will go through the form and accept/reject it and now if admin accept it so the all orders were showing the singer/engineer/lyricist in their dashboard they can pick them but at a time they only pick one because they are already working on one project so they cant pick another if they are done their previous work then they pick another proeject,and the standard time is 3hrs but what if crafter dont deleiver the project on time so the order will extend to 2 hrs more , after 2 hrs if it still not deleiver so it will charge the plenty  after 1 plenty in admin the planty user highlight some sort of red sign after 3 plenties the working task will be freeze to 2 hours also if some other crafter pick the available task so the other crafters dont pick it make it unshown to other crafters,after the crafter is completed the task like the lyricist now it will move to the singer and engineer and if lyricist comlpeted the task so it will go to the admin for revision if admin accept so it will go to singer dashboard,and same goes to singer and engineer now the song is done so after completing the song we send an email to orderer.