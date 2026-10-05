import { useState, useEffect, useRef, useCallback } from "react";
import Timeline from "../components/Timeline";

const SOUNDS = {
  horse: "/sounds/horse.mp3",
  dog:   "/sounds/dog.mp3",
};

const ATTACK_STYLE = `
@keyframes rideIn {
  from { transform: translateX(-160%) translateY(0); opacity: 0; }
  to   { transform: translateX(-30%)  translateY(0); opacity: 1; }
}
@keyframes dogIn {
  from { transform: translateX(-350%) translateY(130%); opacity: 0; }
  to   { transform: translateX(-10%)  translateY(0);   opacity: 1; }
}
`;

const HAARETZ_URL = "https://www.haaretz.co.il/misc/2010-01-22/ty-article/0000017f-e98d-d62c-a1ff-fdff8c050000?gift=562668766f4f47e1b966494a68778732";

const DRAMA_CAROUSEL = [
  {
    headline: "הבן שלא שתק",
    body: "ביום שישי, עובדיה גדסי, חייל בחיל הצנחנים חזר הביתה לחופשה מהצבא ומצא את אמו הפצועה. כאשר ראה את השומר קום רוכב סמוך למעברה, ניגש אליו ודרש שילכו יחד למשטרה בעקבות התקיפה של אמו. אך השומר קום ענה: ״אני משטרה וממשלה בעצמי, ואני יכול להרוג אותך במקום״ והסתלק משם ברכיבה.",
    image: "soldier",
    caption: "עובדיה גדסי מול השומר",
  },
  {
    headline: "באים לעזרת חבר",
    body: "בשבת בבוקר לאחר תפילת השחרית, עובדיה גייס כמה חברים טובים ואת האח הצעיר של אחד מהם כפתיון, והם ניסו לארוב לשומר משה קום בפרדס. אך קום לא נראה בסביבה והם חזרו אל המעברה מאוכזבים.",
    image: "ambush2",
    caption: "המחשה ב-AI: חיילים וילד אורבים לשומר בין עצי הפרדס",
  },
  {
    headline: "חשבון לא סגור",
    body: "עובדיה וחבריו חזרו אל המעברה והופתעו לראות את משה קום רוכב על סוסתו בסמוך. הרוחות התלהטו, השומר קום שיסה את כלבתו בעובדיה וחבריו, אך עובדיה תפס את מלתעות הכלבה שייללה בכאב. הגרסאות רבות וסותרות, אך נראה שכולם חטפו מהלומה או שתיים ויש הטוענים שאף נורו כמה יריות מאקדחו של קום.",
    image: "fight",
    caption: "לא מתעסקים עם עובדיה וחבריו",
  },
];

const IMGS = {
  gazal:   "/images/gazal.jpg",
  gazalBasket: "/images/gazal-basket.jpg",
  guardOnHorse: "/images/guard-on-horse.png",
  bulldog: "/images/bulldog.png",
  soldier: "/images/ovadia-and-guard.jpg",
  siege:   "/images/siege.jpg",
  mapVintage: "/images/map-emek-hefer-vintage.jpg",
  maabara1: "/images/maabara-1950s.jpg",
  ovadia:  "/images/grandpa-ovadia.jpg",
  sara:    "/images/grandma-sara.jpg",
  ambush2: "/images/ambush.jpg",
  fight:   "/images/unsettled-score.jpg",
  brokencar: "/images/broken-police-car.jpg",
  ovadiaVsCop: "/images/arrest-attempt.jpg",
  siegeArrest: "/images/siege.jpg",
  bgSends: "/images/ben-gurion.jpg",
  presser: "/images/police-press-conference.jpg",
  argument: "/images/yeshayahu-vs-mosenzon.jpg",
  haaretzMagazine: "/images/haaretz-magazine.jpg",
};

// Newspaper clipping headlines (styled as image-like elements)
const CLIPPINGS = [
  { paper: "מעריב", date: "26.10.1952", headline: "נעצרו 105 תושבי מעברה", sub: "פצעו שומר ואח״כ התקיפו תגבורת שוטרים" },
  { paper: "קול העם", date: "04.11.1952", headline: "את ההתנהגות האכזרית של המשטרה", sub: "קרא לפיטורי הקצין — ״שיטות מנדטוריות״" },
  { paper: "שעורים", date: "03.11.1952", headline: "מה אירע במעברת עמק חפר?", sub: "שומר שחצן ואכזר — פזיזות קציני משטרה" },
  { paper: "הארץ", date: "07.11.1952", headline: "מפקח משטרה על פרשת עמק חפר", sub: "״בשתים שגתה המשטרה בפעולתה...״" },
];

const slides = [
  {
    id: 0,
    label: "הרקע",
    date: "סתיו 1952",
    headline: "מעברת עמק חפר",
    body: "במעברה שוכנו למעלה מ-2,500 עולים — רובם מתימן — בבדונים ובצריפים. עבודה קשה, תנאים עלובים, ושומר פרדסים אחד מהיישוב השכן גבעת חיים שהפך לסמל הפערים בין העולים הוותיקים לעולים החדשים.",
    image: IMGS.mapVintage,
    imageCaption: "מיקום מעברת עמק חפר, ליד גבעת חיים",
    align: "right",
    accent: "#2c2c2c",
  },
  {
    id: 1,
    label: "הניצוץ",
    date: "חמישי, 23 באוקטובר 1952",
    headline: "גזל והשומר",
    body: "ביום חמישי, גזל גדסי, אשה מבוגרת מהמעברה, יצאה ללקט עשבים לסוף השבוע עבור העז שלה בשדות הסמוכים. השומר של קיבוץ גבעת חיים — משה קום — רכוב על סוסה שחורה, פיזר את כל תכולת הסל של גזל, האשים אותה בגניבת פירות ושיסה בה את כלבת הבולדוג שלו ״מנרה״. גזל חזרה למעברה פצועה ופגועה.",
    image: IMGS.gazalBasket,
    imageCaption: "המחשה ב-AI: גזל גדסי מלקטת עשבים",
    align: "left",
    accent: "#5c3a1e",
  },
  {
    id: 2,
    label: "הדרמה",
    date: "שישי-שבת, 24-25 באוקטובר 1952",
    headline: "הבן שלא שתק",
    body: "עובדיה גדסי, חייל צה״ל שהגיע הביתה לסוף השבוע, מצא את אמו פצועה. עובדיה דרש מהשומר ללכת למשטרה. אך השומר קום ענה: ״אני משטרה וממשלה בעצמי, ואני יכול להרוג אותך במקום.״ — ושיסה בו את הכלבה. עובדיה קרא לחבריו לעזרה, אך השומר ירה שתי יריות והסתלק.",
    image: IMGS.soldier,
    imageCaption: "עובדיה גדסי מול השומר",
    align: "right",
    accent: "#2c2c2c",
    pullQuote: "״אני משטרה וממשלה בעצמי, ואני יכול להרוג אותך במקום.״",
  },
  {
    id: 3,
    label: "המצור",
    date: "שבת-ראשון, 25-26 באוקטובר 1952",
    headline: "מאתיים שוטרים בחושך",
    body: "לפני עלות השחר הקיפו מאות שוטרים את המעברה. כאלף גברים ונערים הוצאו מבתיהם. 105 נעצרו והועברו לכלא חדרה.",
    image: IMGS.siege,
    imageCaption: "המצור על מעברת עמק חפר, לפני שחר",
    align: "left",
    accent: "#1a1a1a",
  },
  {
    id: 4,
    label: "הסערה",
    date: "נובמבר 1952",
    headline: "בן גוריון מתערב",
    body: "",
    image: IMGS.bgSends,
    imageCaption: "",
    align: "right",
    accent: "#2c2c2c",
  },
  {
    id: 5,
    label: "הגילוי",
    date: "ינואר 2010 — 58 שנה אחר כך",
    headline: "המרי המזרחי הראשון שנשכח",
    body: "בשנת 2010 פרסם שי פוגלמן כתבה בעיתון הארץ: ״ההתקוממות הזאת היתה המרי המזרחי הראשון בתולדות המדינה — שנקבר בין דפי ההיסטוריה.״ גולשים ומדריכי טיולים המשיכו להדהד את הסיפור בכתבה גם שנים אחר כך. בעקבות זאת, משפחת גדסי גילתה לראשונה על הדרמה המשפחתית שהתחוללה בשנים הראשונות לאחר קום המדינה, רק שנים רבות לאחר פטירתו של עובדיה גדסי ז״ל.",
    image: IMGS.haaretzMagazine,
    imageCaption: "כתבת המגזין של הארץ, ינואר 2010",
    align: "left",
    accent: "#5c3a1e",
    isLast: true,
  },
];

const BG_CAROUSEL = [
  {
    src: IMGS.mapVintage,
    caption: "מפת עמק חפר, אזור המעברה",
    headline: "מעברת עמק חפר",
    body: "במעברה שוכנו כ-2,000 עולים — רובם מתימן — בבדונים ובצריפים. עבודה קשה, תנאים עלובים, ושומר פרדסים אחד מהקיבוץ השכן גבעת חיים שהפך לסמל הפערים בין העולים הוותיקים לעולים החדשים.",
  },
  {
    src: IMGS.maabara1,
    caption: "עולים במעברה, תחילת שנות ה-50 · צילום: Robert Capa/Magnum",
    headline: "תסיסה במעברות",
    body: "סבלנותם של העולים במעברות החלה לפקוע לאחר שבתי הקבע שהובטחו להם עוד לא נראו באופק והחשש מעוד עונת גשמים הלך וגבר. מצוקת העולים הגיעה עד מסדרונות הסוכנות היהודית והכנסת, אך המענה בושש לבוא.",
  },
  {
    src: "/images/floods.jpg",
    caption: "הצפות במעברה, שנות ה-50, הארכיון הציוני המרכזי",
    headline: "רעב והצפות",
    body: "תושבי המעברות זכרו היטב את ההצפות של החורף שעבר בשבילי המעברות הבוציים ובין האוהלים והבדונים ששימשו למגורי העולים. הקצבות המזון היו מצומצמות והיה קושי להשיג מזון מספיק. עם או בלי קשר למה שאירע, בימים ובשבועות לאחר מכן התרחשו הפגנות שונות במעברות רבות ברחבי הארץ.",
  },
];

const STORM_CAROUSEL = [
  {
    headline: "בן גוריון מתערב",
    body: "הפרשה הגיעה לכנסת ולשולחנו של ראש הממשלה. תוך יום יומיים לאחר המעצר, כבר שלח בן גוריון את ח״כ ישראל ישעיהו ממוצא תימני, כשליחו לחקור את העניין יחד עם המזכיר הצבאי נחמיה ארגוב, שהמליצו לשחרר כמה שיותר עצורים ולסגור את העניין ללא מהומה.",
    image: "bgSends",
    caption: "בן גוריון שולח את ח״כ ישעיהו והמזכיר הצבאי ארגוב לעמק חפר",
  },
  {
    headline: "גרסת המשטרה",
    body: "הפרשה המשיכה להעסיק את העיתונים ופורסמו גרסאות סותרות מטעם המשטרה ותושבי המעברה. ועד המעברה כינס מסיבת עיתונאים ב-2.11.52 כדי להשמיע את גרסתם. בתגובה כינסה המשטרה יומיים אחר כך מסיבת עיתונאים משלה. במסיבת העיתונאים טען מפקד מחוז חיפה מטעם המשטרה שטעו בנסיגה המוקדמת ושהכוחות הגדולים נועדו רק לשמור על שלום הציבור אל מול ההמון המתפרע והאלים. המפקד טען שאם לא היו 200 שוטרים שרצו למנוע שפיכות דמים זה היה נגמר רע יותר. דובר המשטרה יגאל מוסינזון, טען שהשוטרים מוכשרים לטפל בציבור חלש ופרימיטיבי כפי שהגדירו ח״כ ישעיהו.",
    image: "presser",
    caption: "מפקח המשטרה במסיבת העיתונאים",
    pullQuote: "״על כף המאזניים היתה לא רק הפרסטיז׳ה של המשטרה, אלא גם של מרות המדינה.״ — המפקח אבינרי",
  },
  {
    headline: "סערה בעיתונים",
    body: "במשך כשבועיים עוד המשיכו המשטרה, ונציגי ועד המעברה וח״כ ישעיהו להחליף גרסאות על גבי העיתונים, עד שהעניין בסיפור דעך.",
    image: "argument",
    caption: "המחשה ב-AI: ח״כ ישעיהו ודובר המשטרה מוסינזון מתווכחים על רקע כותרות עיתוני התקופה",
  },
];

const SIEGE_CAROUSEL = [
  {
    headline: "נקמת השומר",
    body: "בשעות הצהריים של יום השבת חזר השומר קום למעברה בניידת משטרה מלווה בשלושה שוטרים. בעת ששני שוטרים מחפשים אחר המעורבים בקטטה, התעוררה מהומה סביב הניידת שנכנסה למעברה בשבת ובה ישב השומר השנוא. לאחר שהתושבים ניפצו את חלון הניידת השוטרים נאלצו לסגת כדי לקרוא לתגבורת.",
    image: "brokencar",
    caption: "חלון הניידת השבור, תמונה מתוך הכתבה על הפרשה בירחון העולם הזה",
  },
  {
    headline: "2:0 למעברה",
    body: "השוטרים המבוהלים דרשו תגבורת גדולה, אך מפקד התחנה, תושב גבעת חיים בעצמו, אסף 25 משוטרי התחנה ושלח אותם שנית עוד בצהרי יום השבת כדי להשתלט על ״העולים הפוחזים״ ולהעמיד את האשמים לדין. כשהשוטרים הגיעו לצריף של עובדיה הם דרשו ממנו לבוא איתם לתחנה, אך הוא סירב וטען שרק משטרה צבאית רשאית לעצור חייל. בחלק מהדיווחים נמסר שהשוטרים אף פרצו לבית הכנסת של המעברה בחיפוש אחר האשמים. התושבים הכועסים מחו על ניסיון המעצר וחילול השבת ובמקום התפתחה מהומה. המשטרה נאלצה לסגת שנית",
    image: "ovadiaVsCop",
    caption: "המחשה ב-AI: עובדיה עומד על זכותו בתוך המהומה במעברה.",
  },
  {
    headline: "המעברה נפלה",
    body: "לאחר הנסיגה החליט מפקד התחנה לגייס כוח של כ-200-300 שוטרים. הוחלט לחזור אל המעברה כבר לפנות בוקר יום ראשון כדי למצות את הדין. כוח המשטרה הגדול נערך סביב המעברה ומתוך מאות גברים ונערים 105 נלקחו למעצר בחדרה כבר באותו בוקר. 39 מהם, כולל שני נערים, נשארו במעצר למשך הלילה והובאו לפני שופט למחרת. מהמעברה יצאה אליהם משלחת עם סירי אוכל לעודדם. בהתערבות מנהל המעברה, הסכים השופט להפחית בעונשם של העצורים ולהסתפק בקנסות מופחתים. עובדיה לא נתפס על ידי המשטרה אך הסגיר את עצמו, ולא ברור מה היה עונשו בסופו של דבר.",
    image: "siegeArrest",
    caption: "המחשה ב-AI: המצור על מעברת עמק חפר לפנות שחר",
    pullQuote: "״על כף המאזניים היתה לא רק הפרסטיז׳ה של המשטרה, אלא גם של מרות המדינה.״ — המפקח אבינרי",
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [showHaaretz, setShowHaaretz] = useState(false);
  const [showPress, setShowPress] = useState(false);
  const [showFamily, setShowFamily] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [dramaIdx, setDramaIdx] = useState(0);
  const [siegeIdx, setSiegeIdx] = useState(0);
  const [stormIdx, setStormIdx] = useState(0);
  const slideRef = useRef(null);
  const activeAudiosRef = useRef([]);

  const stopSounds = useCallback(() => {
    activeAudiosRef.current.forEach(a => { a.pause(); a.currentTime = 0; });
    activeAudiosRef.current = [];
  }, []);

  const playSlide1Sounds = useCallback(() => {
    stopSounds();
    const horse = new Audio(SOUNDS.horse);
    horse.volume = 0.6;
    horse.play().catch(() => {});
    setTimeout(() => { horse.pause(); horse.currentTime = 0; }, 3000);
    activeAudiosRef.current.push(horse);

    const t = setTimeout(() => {
      const dog = new Audio(SOUNDS.dog);
      dog.volume = 0.7;
      dog.play().catch(() => {});
      setTimeout(() => { dog.pause(); dog.currentTime = 0; }, 3000);
      activeAudiosRef.current.push(dog);
    }, 1400);

    return t;
  }, [stopSounds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx(i => (i + 1) % BG_CAROUSEL.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (current !== 2) return;
    const timer = setInterval(() => {
      setDramaIdx(i => (i + 1) % DRAMA_CAROUSEL.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [current]);

  useEffect(() => {
    if (current !== 3) return;
    const timer = setInterval(() => {
      setSiegeIdx(i => (i + 1) % SIEGE_CAROUSEL.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [current]);

  useEffect(() => {
    if (current !== 4) return;
    const timer = setInterval(() => {
      setStormIdx(i => (i + 1) % STORM_CAROUSEL.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (i) => {
    stopSounds();
    setCurrent(i);
    if (i === 1) playSlide1Sounds();
    setTimeout(() => slideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const slide = slides[current];

  return (
    <div style={{ fontFamily: "var(--font-lunasima), sans-serif", direction: "rtl", background: "#f7f4ef", minHeight: "100vh", color: "#1a1a1a" }}>

      {/* ══ MASTHEAD ══ */}
      <header style={{ background: "#f7f4ef", borderBottom: "3px solid #1a1a1a", padding: "0 0 0" }}>
        {/* Main title */}
        <div style={{ textAlign: "center", padding: "32px 20px 20px" }}>
          <h1 style={{
            fontFamily: "var(--font-rubik), sans-serif",
            fontSize: "clamp(40px, 8vw, 96px)",
            fontWeight: "900",
            color: "#1a1a1a",
            margin: "0",
            lineHeight: "1",
            letterSpacing: "-2px",
            fontFamily: "var(--font-rubik), sans-serif",
          }}>
            עובדיה גדסי
          </h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", margin: "14px 0 10px" }}>
            <div style={{ flex: 1, height: "1px", background: "#1a1a1a", maxWidth: "180px" }} />
            <p style={{ fontSize: "clamp(13px, 2.5vw, 18px)", color: "#444", margin: 0, fontStyle: "italic", letterSpacing: "1px" }}>
              לוחם הצדק ממעברת עמק חפר
            </p>
            <div style={{ flex: 1, height: "1px", background: "#1a1a1a", maxWidth: "180px" }} />
          </div>
          <p style={{ fontSize: "12px", color: "#999", letterSpacing: "3px", margin: "0", fontFamily: "var(--font-lunasima), sans-serif", textTransform: "uppercase" }}>
            אוקטובר-נובמבר 1952
          </p>
        </div>

        {/* Nav */}
        <div style={{ borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "center", gap: "0" }}>
          {["הסיפור", "הסיקור בעיתונות", "המשפחה"].map((label, i) => (
            <button key={i} onClick={() => { if(i===0){setShowPress(false);setShowFamily(false);} if(i===1){setShowPress(true);setShowFamily(false);} if(i===2){setShowFamily(true);setShowPress(false);} }}
              style={{
                padding: "10px 28px",
                background: "transparent",
                border: "none",
                borderLeft: i > 0 ? "1px solid #ddd" : "none",
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: "var(--font-lunasima), sans-serif",
                letterSpacing: "1px",
                color: "#1a1a1a",
                fontWeight: (!showPress && !showFamily && i===0) || (showPress && i===1) || (showFamily && i===2) ? "700" : "400",
                borderBottom: (!showPress && !showFamily && i===0) || (showPress && i===1) || (showFamily && i===2) ? "3px solid #1a1a1a" : "3px solid transparent",
              }}
            >{label}</button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "0 16px 80px" }}>

        {/* ══ STORY VIEW ══ */}
        {!showPress && !showFamily && (
          <>
            {/* Intro blurb */}
            <div style={{ borderBottom: "1px solid #ddd", padding: "28px 0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              <p style={{ fontSize: "clamp(15px, 2vw, 17px)", lineHeight: "1.9", margin: 0, color: "#333", gridColumn: "1 / -1" }}>
                מפגש קצר בין אישה תימניה מבוגרת מהמעברה לשומר הפרדסים מהיישוב הסמוך בסתיו 1952, הצית שרשרת אירועים שהגיעה עד לשולחנו של בן גוריון והעסיקה את התקשורת במשך שבועות ארוכים. הסיפור נקבר במשך כמעט שישים שנה עד שכתבה בעיתון הארץ הציפה אותו מחדש בשנת 2010.
              </p>
            </div>

            {/* CHAPTER DOTS NAV */}
            <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #ddd", marginBottom: "0", overflowX: "auto" }}>
              {slides.map((s, i) => (
                <button key={i} onClick={() => goTo(i)} style={{
                  padding: "12px 16px",
                  background: "transparent",
                  border: "none",
                  borderBottom: current === i ? "3px solid #1a1a1a" : "3px solid transparent",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "var(--font-lunasima), sans-serif",
                  color: current === i ? "#1a1a1a" : "#888",
                  fontWeight: current === i ? "700" : "400",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.5px",
                }}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* SLIDE */}
            <div ref={slideRef} style={{ minHeight: "520px", padding: "40px 0", borderBottom: "1px solid #ddd" }}>
              {/* Date + chapter */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <span style={{ fontSize: "11px", fontFamily: "var(--font-lunasima), sans-serif", letterSpacing: "2px", color: "#888", textTransform: "uppercase" }}>
                  {slide.date}
                </span>
                <div style={{ flex: 1, height: "1px", background: "#ddd" }} />
              </div>

              {/* Content grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: slide.align === "center" ? "1fr" : "1fr 1fr",
                gap: "40px",
                alignItems: "start",
              }}>
                {/* Text side */}
                <div style={{ order: slide.align === "left" ? 2 : 1 }}>
                  <h2 style={{
                    fontFamily: "var(--font-rubik), sans-serif",
                    fontSize: "clamp(26px, 4vw, 42px)",
                    fontWeight: "700",
                    color: "#1a1a1a",
                    lineHeight: "1.15",
                    margin: "0 0 20px",
                    letterSpacing: "-0.5px",
                    transition: "opacity 0.5s ease",
                  }}>
                    {slide.id === 0 ? BG_CAROUSEL[carouselIdx].headline : slide.id === 2 ? DRAMA_CAROUSEL[dramaIdx].headline : slide.id === 3 ? SIEGE_CAROUSEL[siegeIdx].headline : slide.id === 4 ? STORM_CAROUSEL[stormIdx].headline : slide.headline}
                  </h2>

                  <p style={{ fontSize: "clamp(15px, 2vw, 17px)", lineHeight: "2", color: "#333", margin: "0 0 24px", transition: "opacity 0.5s ease" }}>
                    {slide.id === 0 ? BG_CAROUSEL[carouselIdx].body : slide.id === 2 ? DRAMA_CAROUSEL[dramaIdx].body : slide.id === 3 ? SIEGE_CAROUSEL[siegeIdx].body : slide.id === 4 ? STORM_CAROUSEL[stormIdx].body : slide.body}
                  </p>

                  {(slide.pullQuote || (slide.id === 3 && SIEGE_CAROUSEL[siegeIdx].pullQuote) || (slide.id === 4 && STORM_CAROUSEL[stormIdx].pullQuote)) && !(slide.id === 2 && dramaIdx !== 0) && (
                    <div style={{
                      borderTop: "2px solid #1a1a1a",
                      borderBottom: "1px solid #ddd",
                      padding: "20px 0",
                      margin: "24px 0",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-rubik), sans-serif",
                        fontSize: "clamp(16px, 2.5vw, 20px)",
                        fontStyle: "italic",
                        color: "#1a1a1a",
                        lineHeight: "1.6",
                        margin: 0,
                      }}>
                        {slide.id === 3 ? SIEGE_CAROUSEL[siegeIdx].pullQuote : slide.id === 4 ? STORM_CAROUSEL[stormIdx].pullQuote : slide.pullQuote}
                      </p>
                    </div>
                  )}

                  {slide.isLast && (
                    <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <button onClick={() => setShowHaaretz(true)} style={{
                        padding: "12px 24px",
                        background: "#1a1a1a",
                        color: "#f7f4ef",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontFamily: "var(--font-lunasima), sans-serif",
                        letterSpacing: "1px",
                      }}>
                        כתבת הארץ 2010 ←
                      </button>
                      <button onClick={() => setShowPress(true)} style={{
                        padding: "12px 24px",
                        background: "transparent",
                        color: "#1a1a1a",
                        border: "1px solid #1a1a1a",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontFamily: "var(--font-lunasima), sans-serif",
                        letterSpacing: "1px",
                      }}>
                        עיתונות התקופה ←
                      </button>
                    </div>
                  )}
                </div>

                {/* Image side */}
                {slide.image && (
                  <div style={{ order: slide.align === "left" ? 1 : 2 }}>
                    {slide.id === 0 ? (
                      /* Carousel for הרקע slide */
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "relative", width: "100%", paddingBottom: "100%", overflow: "hidden", borderBottom: "3px solid #1a1a1a" }}>
                          {BG_CAROUSEL.map((item, i) => (
                            <img key={i} src={item.src} alt={item.caption}
                              style={{
                                position: "absolute", inset: 0, width: "100%", height: "100%",
                                objectFit: "cover", objectPosition: i === 0 ? "top center" : "center",
                                filter: i === 1 || i === 2 ? "grayscale(100%) contrast(1.05)" : "grayscale(20%) contrast(1.05)",
                                opacity: carouselIdx === i ? 1 : 0,
                                transition: "opacity 0.8s ease",
                              }} />
                          ))}
                        </div>
                        <p style={{ fontSize: "11px", color: "#888", margin: "8px 0 4px", fontFamily: "var(--font-lunasima), sans-serif", fontStyle: "italic", minHeight: "16px" }}>
                          {BG_CAROUSEL[carouselIdx].caption}
                        </p>
                        <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                          {BG_CAROUSEL.map((_, i) => (
                            <button key={i} onClick={() => setCarouselIdx(i)} style={{
                              width: "8px", height: "8px", borderRadius: "50%",
                              background: carouselIdx === i ? "#1a1a1a" : "#ccc",
                              border: "none", cursor: "pointer", padding: 0,
                            }} />
                          ))}
                        </div>
                      </div>
                    ) : slide.id === 2 ? (
                      /* Carousel for הדרמה slide */
                      <div style={{ position: "relative" }}>
                        <div style={{ position: "relative", width: "100%", paddingBottom: "100%", overflow: "hidden", borderBottom: "3px solid #1a1a1a" }}>
                          {DRAMA_CAROUSEL.map((item, i) => (
                            <img key={i} src={IMGS[item.image]} alt={item.caption}
                              style={{
                                position: "absolute", inset: 0, width: "100%", height: "100%",
                                objectFit: "cover", objectPosition: "center",
                                filter: "grayscale(20%) contrast(1.05)",
                                opacity: dramaIdx === i ? 1 : 0,
                                transition: "opacity 0.8s ease",
                              }} />
                          ))}
                        </div>
                        <p style={{ fontSize: "11px", color: "#888", margin: "8px 0 4px", fontFamily: "var(--font-lunasima), sans-serif", fontStyle: "italic", minHeight: "16px" }}>
                          {DRAMA_CAROUSEL[dramaIdx].caption}
                        </p>
                        <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                          {DRAMA_CAROUSEL.map((_, i) => (
                            <button key={i} onClick={() => setDramaIdx(i)} style={{
                              width: "8px", height: "8px", borderRadius: "50%",
                              background: dramaIdx === i ? "#1a1a1a" : "#ccc",
                              border: "none", cursor: "pointer", padding: 0,
                            }} />
                          ))}
                        </div>
                      </div>
                    ) : slide.id === 4 ? (
                      /* Carousel for הסערה slide */
                      <div style={{ position: "relative" }}>
                        <div style={{ position: "relative", width: "100%", paddingBottom: "100%", overflow: "hidden", borderBottom: "3px solid #1a1a1a" }}>
                          {STORM_CAROUSEL.map((item, i) => (
                            <img key={i} src={IMGS[item.image]} alt={item.caption}
                              style={{
                                position: "absolute", inset: 0, width: "100%", height: "100%",
                                objectFit: "cover", objectPosition: "center",
                                filter: "grayscale(20%) contrast(1.05)",
                                opacity: stormIdx === i ? 1 : 0,
                                transition: "opacity 0.8s ease",
                              }} />
                          ))}
                        </div>
                        <p style={{ fontSize: "11px", color: "#888", margin: "8px 0 4px", fontFamily: "var(--font-lunasima), sans-serif", fontStyle: "italic", minHeight: "16px" }}>
                          {STORM_CAROUSEL[stormIdx].caption}
                        </p>
                        <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                          {STORM_CAROUSEL.map((_, i) => (
                            <button key={i} onClick={() => setStormIdx(i)} style={{
                              width: "8px", height: "8px", borderRadius: "50%",
                              background: stormIdx === i ? "#1a1a1a" : "#ccc",
                              border: "none", cursor: "pointer", padding: 0,
                            }} />
                          ))}
                        </div>
                      </div>
                    ) : slide.id === 3 ? (
                      /* Carousel for המצור slide */
                      <div style={{ position: "relative" }}>
                        <div style={{ position: "relative", width: "100%", paddingBottom: "100%", overflow: "hidden", borderBottom: "3px solid #1a1a1a" }}>
                          {SIEGE_CAROUSEL.map((item, i) => (
                            <img key={i} src={IMGS[item.image]} alt={item.caption}
                              style={{
                                position: "absolute", inset: 0, width: "100%", height: "100%",
                                objectFit: "cover", objectPosition: "center",
                                filter: "grayscale(20%) contrast(1.05)",
                                opacity: siegeIdx === i ? 1 : 0,
                                transition: "opacity 0.8s ease",
                              }} />
                          ))}
                        </div>
                        <p style={{ fontSize: "11px", color: "#888", margin: "8px 0 4px", fontFamily: "var(--font-lunasima), sans-serif", fontStyle: "italic", minHeight: "16px" }}>
                          {SIEGE_CAROUSEL[siegeIdx].caption}
                        </p>
                        <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                          {SIEGE_CAROUSEL.map((_, i) => (
                            <button key={i} onClick={() => setSiegeIdx(i)} style={{
                              width: "8px", height: "8px", borderRadius: "50%",
                              background: siegeIdx === i ? "#1a1a1a" : "#ccc",
                              border: "none", cursor: "pointer", padding: 0,
                            }} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ position: "relative" }}>
                        <style>{ATTACK_STYLE}</style>
                        <div style={{ position: "relative", overflow: "hidden" }}>
                          <img src={slide.image} alt={slide.headline}
                            style={{ width: "100%", display: "block", filter: "grayscale(20%) contrast(1.05)", borderBottom: "3px solid #1a1a1a" }} />
                          {slide.id === 1 && (
                            <>
                              <img
                                key={`guard-${current}`}
                                src={IMGS.guardOnHorse}
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                                alt="השומר על הסוס"
                                style={{
                                  position: "absolute",
                                  bottom: "0%",
                                  left: "-5%",
                                  width: "102%",
                                  objectFit: "contain",
                                  animation: "rideIn 1.4s cubic-bezier(0.22,0.61,0.36,1) 0.4s both",
                                  pointerEvents: "none",
                                }}
                              />
                              <img
                                key={`dog-${current}`}
                                src={IMGS.bulldog}
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                                alt="כלבת הבולדוג"
                                style={{
                                  position: "absolute",
                                  bottom: "5%",
                                  left: "44%",
                                  width: "30%",
                                  objectFit: "contain",
                                  animation: "dogIn 1.1s cubic-bezier(0.22,0.61,0.36,1) 1.4s both",
                                  pointerEvents: "none",
                                }}
                              />
                            </>
                          )}
                        </div>
                        {slide.imageCaption && (
                          <p style={{ fontSize: "11px", color: "#888", margin: "8px 0 0", fontFamily: "var(--font-lunasima), sans-serif", fontStyle: "italic" }}>
                            {slide.imageCaption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}


              </div>
            </div>

            {/* PREV / NEXT */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>
              <button onClick={() => goTo(Math.max(0, current - 1))} disabled={current === 0}
                style={{ padding: "6px 18px", background: "transparent", border: "1px solid #ddd", borderRadius: "4px", cursor: current === 0 ? "default" : "pointer", color: current === 0 ? "#ccc" : "#1a1a1a", fontFamily: "var(--font-lunasima), sans-serif", fontSize: "13px" }}>
                → הקודם
              </button>
              <span style={{ fontSize: "12px", color: "#888", fontFamily: "var(--font-lunasima), sans-serif" }}>
                {current + 1} / {slides.length}
              </span>
              <button onClick={() => goTo(Math.min(slides.length - 1, current + 1))} disabled={current === slides.length - 1}
                style={{ padding: "6px 18px", background: current === slides.length - 1 ? "transparent" : "#1a1a1a", border: "1px solid #1a1a1a", borderRadius: "4px", cursor: current === slides.length - 1 ? "default" : "pointer", color: current === slides.length - 1 ? "#ccc" : "#f7f4ef", fontFamily: "var(--font-lunasima), sans-serif", fontSize: "13px" }}>
                הבא ←
              </button>
            </div>
          </>
        )}

        {/* ══ PRESS VIEW ══ */}
        {showPress && (
          <div style={{ paddingTop: "40px" }}>
            <div style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: "16px", marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "var(--font-rubik), sans-serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: "700", margin: "0 0 6px" }}>
                העיתונות של אוקטובר–נובמבר 1952
              </h2>
              <p style={{ color: "#888", margin: 0, fontSize: "14px", fontFamily: "var(--font-lunasima), sans-serif" }}>
                אותו אירוע — קולות שונים לגמרי
              </p>
            </div>



            {/* Full press voices with scattered newspaper headers */}
            {[
              { who: "דבר", role: "א. סלע, מפקד מחוז חיפה, 4 בנובמבר 1952", q: "בשתים שגתה המשטרה: א) בנסיגת 25 השוטרים, ב) באי הזמנת נציגי העתונות. — אולם אילו הייתי במקום השוטרים — הייתי פותח ראשים, למען ידעו כי אין לזלזל במשטרה.", imgIdx: 0 },
              { who: "קול העם", role: "4 בנובמבר 1952", q: "ההתנהגות האכזרית של המשטרה במעברת עמק חפר מחייבת להקים ועדה פרלמנטרית. הקצין סלע — פותח הראשים — מגלה את פרצופה האמיתי של משטרת בן-גוריון.", imgIdx: 1 },
              { who: "ח\"כ ישראל ישעיהו", role: "מכתב לעיתון הארץ, נובמבר 1952", q: "המשטרה גרמה בזיון והשפלה לאלפי יהודים תמימים וישרים, שעד כה היו מרגישים עצמם מאושרים לראות שוטרים יהודים." },
              { who: "שי פוגלמן", role: "הארץ, 22 בינואר 2010", q: "ההתקוממות הזאת היתה, ככל הנראה, המרי המזרחי הראשון בתולדות המדינה. מדוע אין לה כמעט שום אזכור בספרי ההיסטוריה?", imgIdx: 2 },
            ].map((v, i) => {
              const newspaperImages = [
                "/images/logo-davar.png",
                "/images/logo-kol-haam.png",
                "/images/logo-haaretz.png",
              ];
              return (
                <div key={i}>
                  <div style={{ borderTop: "1px solid #ddd", padding: "24px 0", display: "grid", gridTemplateColumns: "160px 1fr", gap: "24px", alignItems: "start" }}>
                    <div>
                      <p style={{ fontWeight: "700", margin: "0 0 4px", fontSize: "15px" }}>{v.who}</p>
                      <p style={{ fontSize: "12px", color: "#888", margin: 0, fontFamily: "var(--font-lunasima), sans-serif" }}>{v.role}</p>
                    </div>
                    <blockquote style={{ margin: 0, fontStyle: "italic", fontSize: "clamp(14px,2vw,16px)", lineHeight: "1.8", color: "#1a1a1a", borderRight: "3px solid #1a1a1a", paddingRight: "16px" }}>
                      ״{v.q}״
                    </blockquote>
                  </div>
                  {v.imgIdx !== undefined && (
                    <div style={{ margin: "28px 0 28px", maxWidth: "260px", marginLeft: i % 2 === 0 ? "auto" : "0" }}>
                      <img src={newspaperImages[v.imgIdx]} alt="כותרת עיתון" style={{ width: "100%", border: "1px solid #ddd", filter: "grayscale(15%)", opacity: 0.85 }} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Timeline */}
            <Timeline />
          </div>
        )}

        {/* ══ FAMILY VIEW ══ */}
        {showFamily && (
          <div style={{ paddingTop: "40px" }}>
            <div style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: "16px", marginBottom: "40px" }}>
              <h2 style={{ fontFamily: "var(--font-rubik), sans-serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: "700", margin: "0 0 6px" }}>
                לזכרם של עובדיה ושרה גדסי ז״ל
              </h2>
              <p style={{ color: "#888", margin: 0, fontSize: "14px", fontFamily: "var(--font-lunasima), sans-serif" }}>
                אנשים יראי שמיים וישרי דרך
              </p>
            </div>

            {/* Ovadia + Sara */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "48px", alignItems: "start" }}>
              <div>
                <div style={{ width: "100%", aspectRatio: "2/3", overflow: "hidden", borderBottom: "3px solid #1a1a1a" }}>
                  <img src={IMGS.ovadia} alt="עובדיה גדסי" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%", filter: "contrast(1.05)", display: "block" }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-rubik), sans-serif", fontSize: "22px", margin: "16px 0 4px", fontWeight: "500" }}>עובדיה גדסי</h3>
                <p style={{ fontSize: "12px", color: "#888", margin: "0 0 12px", fontFamily: "var(--font-lunasima), sans-serif", fontStyle: "italic" }}>הצנחן ולוחם הצדק למען אמו</p>
                <p style={{ fontSize: "15px", lineHeight: "1.9", color: "#333", margin: 0 }}>
                  חייל צעיר שחזר אל המעברה לחופשת השבת, מצא את אמו פצועה — ולא שתק. בעיתוני התקופה הוא מוזכר כ״צנחן״. בהמשך שירת במשמר הגבול שנים רבות. הוא נפטר בשנת 2004, והסיפור נקבר יחד עמו, עד שהתגלה לבני המשפחה במקרה.
                </p>
              </div>
              <div>
                <div style={{ width: "100%", aspectRatio: "2/3", overflow: "hidden", borderBottom: "3px solid #1a1a1a" }}>
                  <img src={IMGS.sara} alt="שרה גדסי" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-rubik), sans-serif", fontSize: "22px", margin: "16px 0 4px", fontWeight: "500" }}>שרה גדסי</h3>
                <p style={{ fontSize: "12px", color: "#888", margin: "0 0 12px", fontFamily: "var(--font-lunasima), sans-serif", fontStyle: "italic" }}>אשתו של עובדיה ועמוד התווך של המשפחה</p>
                <p style={{ fontSize: "15px", lineHeight: "1.9", color: "#333", margin: 0 }}>
                  עובדיה ושרה נישאו בתימן זמן קצר לפני עלייתם בעליית על כנפי נשרים. לאחר שנות המעברה הקשות עלו אל הקרקע והיו ממייסדי מושב גבעת יערים. הם הקימו משפחה לתפארת והיו תמיד אנשי מעשה שהלכו בדרך הישר ותרמו בדרכים רבות לקהילה. היא נפטרה בשנת 2025.
                </p>
              </div>
            </div>

            {/* Gazal */}
            <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: "32px", display: "grid", gridTemplateColumns: "220px 1fr", gap: "32px", alignItems: "start" }}>
              <img src={IMGS.gazal} alt="גזל גדסי — איור" style={{ width: "100%", display: "block", borderBottom: "3px solid #1a1a1a", filter: "grayscale(30%)" }} />
              <div>
                <h3 style={{ fontFamily: "var(--font-rubik), sans-serif", fontSize: "22px", margin: "0 0 4px", fontWeight: "500" }}>גזל גדסי</h3>
                <p style={{ fontSize: "12px", color: "#888", margin: "0 0 16px", fontFamily: "var(--font-lunasima), sans-serif", fontStyle: "italic" }}>אמו של עובדיה</p>
                <p style={{ fontSize: "15px", lineHeight: "1.9", color: "#333", margin: "0 0 12px" }}>
                  שמה גזל (גַ'זַל), שנכתב בערבית עם האות ר'יין (غ) ולכן בחלק מהעיתונים נזכרה בשם רזאל — שם יפה שפירושו ״צביה״.
                </p>
                <p style={{ fontSize: "15px", lineHeight: "1.9", color: "#333", margin: 0 }}>
                  אשה תימניה מבוגרת שיצאה לאסוף עשבים לעז שלה — ומפגישה עם שומר פרדסים שינתה את מהלך ההיסטוריה. התמונה כאן היא רק להמחשה כיוון שאין בידינו תמונה שלה ושמה לא מוזכר בספרי ההיסטוריה. כאן נזכור אותה תמיד בלבנו.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ══ FOOTER ══ */}
      <footer style={{ borderTop: "2px solid #1a1a1a", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", background: "#f7f4ef" }}>
        <div>
          <p style={{ fontWeight: "900", margin: "0 0 2px", fontSize: "15px" }}>עובדיה גדסי — לוחם הצדק ממעברת עמק חפר</p>
          <p style={{ color: "#888", margin: 0, fontSize: "12px", fontFamily: "var(--font-lunasima), sans-serif" }}>נאסף ונערך על ידי המשפחה · מקורות: ארכיון עיתוני 1952 · שי פוגלמן, הארץ 2010</p>
        </div>

      </footer>

      {/* ══ HAARETZ POPUP ══ */}
      {showHaaretz && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
          onClick={() => setShowHaaretz(false)}>
          <div style={{ background: "#f7f4ef", width: "100%", maxWidth: "820px", maxHeight: "88vh", display: "flex", flexDirection: "column", border: "2px solid #1a1a1a" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: "12px 20px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontWeight: "900", fontSize: "18px" }}>הארץ</span>
                <span style={{ color: "#888", fontSize: "12px", marginRight: "10px", fontFamily: "var(--font-lunasima), sans-serif" }}>שי פוגלמן · 22 בינואר 2010</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <a href={HAARETZ_URL} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "6px 14px", background: "#1a1a1a", color: "#f7f4ef", textDecoration: "none", fontSize: "12px", fontFamily: "var(--font-lunasima), sans-serif" }}>
                  פתח בדפדפן ↗
                </a>
                <button onClick={() => setShowHaaretz(false)}
                  style={{ width: "32px", height: "32px", background: "transparent", border: "1px solid #ddd", cursor: "pointer", fontSize: "18px" }}>×</button>
              </div>
            </div>
            <iframe src={HAARETZ_URL} style={{ flex: 1, border: "none", minHeight: "400px" }} title="כתבת הארץ 2010" />
          </div>
        </div>
      )}
    </div>
  );
}