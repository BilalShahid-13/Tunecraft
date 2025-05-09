import alex from "../../public/reviews/alex.png";
import angeline from "../../public/reviews/angeline.png";
import francis from "../../public/reviews/francis.png";
import john from "../../public/reviews/john.png";
import kate from "../../public/reviews/kate.png";
import nicolas from "../../public/reviews/nicolas.png";
// footer
import Facebook from "../../public/footer/facebook logo.png";
import Instagram from "../../public/footer/instagram logo.png";
import X from "../../public/footer/x.png";

// questions
import craftersManagment from "@/app/admin/components/craftersManagment";
import projectManagment from "@/app/admin/components/projectManagment";
import UpdatePassword from "@/components/UpdatePassword";
import {
  Check,
  Clipboard,
  ClipboardCheck,
  Clock,
  Key,
  LayoutDashboard,
  LogOut,
  User,
  UsersRound,
  Wallet2,
} from "lucide-react";
import Celebration from "../../public/question/celebration.png";
import loveSong from "../../public/question/love.png";
import Music from "../../public/question/music.png";
import Smile from "../../public/question/smile.png";

export const Currency = "MX$";

export const NavbarItem = [
  { name: "Home", route: "/" },
  { name: "Tunes", route: "/tunes" },
  { name: "About us", route: "/?scrollTo=about-us" },
  { name: "Crafters", route: "/Register" },
];

export const Testimonals = [
  {
    name: "Alex",
    picture: alex,
    stars: 5,
    des: "I ordered a song for our wedding anniversary and it was the best gift! My wife was in tears of happiness and the music was just magical. Thank you for such a unique opportunity!",
  },
  {
    name: "Kate",
    picture: kate,
    stars: 5,
    des: `
    My friend was thrilled with the song that was made especially for him! It was his birthday and when the melody started playing with his name in the lyrics, he just couldn't believe it! A real wow effect!`,
  },
  {
    name: "Francis",
    picture: francis,
    stars: 4,
    des: `
   This musical gift moved my mother to tears! Every note conveyed my feelings. Thank you for creating real emotions!
    `,
  },
  {
    name: "Angeline",
    picture: angeline,
    stars: 5,
    des: `
  I never thought that it would be possible to write such a beautiful song based on my description! It was a gift for my mother, and now she listens to it every day. Thank you for the warmth you put into your work!
    `,
  },
  {
    name: "Nicolas",
    picture: nicolas,
    stars: 5,
    des: `
  I ordered a personal melody for a girl, and it was the best surprise in her life! Cool idea, incredible atmosphere!
    `,
  },
  {
    name: "John",
    picture: john,
    stars: 5,
    des: `
I wanted something unusual, and TUNECRAFT exceeded all expectations! Music, as if created especially for me!    `,
  },
];

export const TunesItem = [
  {
    gradientColor: "0deg,#F70098,#FF7E6E",
    heading: "Microtune",
    price: `${Currency}1499`,
    des: "Ready in 5 business days",
    points: [
      "Your personalized tune, delivered by a professional",
      "Based on your story",
      "6 base tunes",
      "1 minute 30 seconds of tune",
      "1 instrument and vocals",
      "1 lyric review before recording",
    ],
  },
  {
    gradientColor: "0deg,#FF9D76,#FF7E6E",
    heading: "Soundtune",
    price: `${Currency}2299`,
    des: "Ready in 5 business days",
    points: [
      "Your personalized tune by a professional",
      "Based on your story",
      "12 base tunes",
      "2 minutes and 30 seconds of tune",
      "2 instruments and vocals",
      "1 lyric review before recording",
    ],
  },
  {
    gradientColor: "0deg,#FF9D76,#FF7E6E",
    heading: "Supremetune",
    price: `${Currency}3099`,
    des: "Ready in 5 business days",
    points: [
      "Your personalized tune by a professional",
      "Based on your story",
      "20+ base tunes",
      "3 minutes of tuning",
      "1 full band and vocals",
      "2 lyric reviews before recording",
    ],
  },
  {
    gradientColor: "0deg,#F70098,#FF7E6E",
    heading: "Tunecraft",
    price: `${Currency}?`,
    des: "Customized quote",
    points: [
      "100% custom tuning, your specifications",
      "Video call with the tunecraft team",
      "Personalized quote",
    ],
  },
];

export const MelodiesItem = [
  {
    heading: "Birthday song",
    genre: "pop",
    music: "/sample audio/aniversry.mp3",
  },
  {
    heading: "anniversary song",
    genre: "rock",
    music: "/sample audio/happy-birthday-177361.mp3",
  },
  {
    heading: "song for parents",
    genre: "pop",
    music: "/sample audio/happy-birthday-334876.mp3",
  },
];

export const FooterLinks = [
  {
    name: "facebook",
    route: "/",
    icon: Facebook,
  },
  {
    name: "instagram",
    route: "/",
    icon: Instagram,
  },
  {
    name: "x",
    route: "/",
    icon: X,
  },
];

export const QuestionsItem = [
  {
    question: "Love Song",
    des: "Perfect for anniversaries, weddings, or expressing your feelings",
    img: loveSong,
  },
  {
    question: "Birthday Song",
    des: "Make someone's special day even more memorable",
    img: Celebration,
  },
  {
    question: "Custom Song",
    des: "Tell us your story, and we'll create something unique",
    img: Music,
  },
  {
    question: "Friendship Song",
    des: "Celebrate your bond with a special friend",
    img: Smile,
  },
];

export const musicTemplates = [
  {
    title: "Birthday Song",
    category: "Celebration",
  },
  {
    title: "Anniversary Ballad",
    category: "Romance",
  },
  {
    title: "Graduation Anthem",
    category: "Achievement",
  },
  {
    title: "Wedding First Dance",
    category: "Romance",
  },
  {
    title: "Friendship Tribute",
    category: "Personal",
  },
  {
    title: "Family Celebration",
    category: "Family",
  },
  {
    title: "Love Declaration",
    category: "Romance",
  },
  {
    title: "Inspirational Journey",
    category: "Motivation",
  },
];

export const roles = [
  { name: "lyricist", route: "lyricist" },
  { name: "engineer", route: "engineer" },
  { name: "engineer", route: "engineer" },
  { name: "singer", route: "singer" },
  { name: "admin", route: "admin" },
];
export const SidebarItems = [
  {
    name: "Dashoard",
    Icon: LayoutDashboard,
    route: UpdatePassword,
  },
  {
    name: "Tasks",
    Icon: ClipboardCheck,
    route: UpdatePassword,
  },
  {
    name: "Account",
    Icon: User,
    route: UpdatePassword,
  },
  {
    name: "Payments",
    Icon: Wallet2,
    route: UpdatePassword,
  },
  {
    name: "Log out",
    Icon: LogOut,
    route: "/",
  },
];

export const adminPanel = [
  {
    name: "Crafters Managment",
    Icon: UsersRound,
    route: craftersManagment,
  },
  {
    name: "Project Managment",
    Icon: Clipboard,
    route: projectManagment,
  },
];

export const craftersManagmentList = [
  {
    name: "All Users",
    Icon: User,
    description:
      "List of all users who have signed up, including information such as username, phone number, role (lyricist, singer, engineer, etc.), and current status (pending, approved, rejected).",
  },
  {
    name: "Pending Approvals",
    Icon: Clock,
    description:
      "List of users who have signed up but are awaiting admin approval.",
  },
  {
    name: "Approved Users",
    Icon: Check,
    description: "Users who have been approved and are now active members.",
  },
  {
    name: "User Roles",
    Icon: Key,
    description:
      "Assign or edit user roles (Lyricist, Singer, Engineer, Admin, etc.).",
  },
];
