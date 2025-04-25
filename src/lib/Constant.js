import alex from "../../public/reviews/alex.png";
import kate from "../../public/reviews/kate.png";
import francis from "../../public/reviews/francis.png";
import angeline from "../../public/reviews/angeline.png";
import nicolas from "../../public/reviews/nicolas.png";
import john from "../../public/reviews/john.png";
// footer
import Facebook from "../../public/footer/facebook logo.png";
import Instagram from "../../public/footer/instagram logo.png";
import X from "../../public/footer/x.png";

// questions
import loveSong from "../../public/question/love.png";
import Celebration from "../../public/question/celebration.png";
import Music from "../../public/question/music.png";
import Smile from "../../public/question/smile.png";

export const NavbarItem = [
  { name: "Home", route: "/" },
  { name: "Tunes", route: "/tunes" },
  { name: "About us", route: "/about" },
  { name: "Crafters", route: "/crafters" },
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
    price: "$1.499",
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
    price: "$2.299",
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
    price: "$3.099",
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
    price: "$?",
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
  },
  {
    heading: "anniversary song",
    genre: "rock",
  },
  {
    heading: "song for parents",
    genre: "pop",
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
