import { useState } from "react";

const PRESS_ITEMS = [
  {
    date: "26.10.1952",
    dateLabel: "26 באוקטובר 1952",
    articles: [
      {
        paper: "מעריב",
        headline: "נעצרו 105 תושבי מעברה",
        sub: "פצעו שומר ואח״כ התקיפו תגבורת שוטרים — כוחות משטרה הקיפו את מעברת עמק חפר וערכו סריקה",
        image: "/images/clip-1261052.jpg",
      },
    ],
  },
  {
    date: "27.10.1952",
    dateLabel: "27 באוקטובר 1952",
    articles: [
      {
        paper: "מעריב",
        headline: "ה׳קרב׳ על רקע של גניבת פרי",
        sub: "שומר וכלבו גרמו להתנגשות בין המשטרה ותושבי מעברת עמק-חפר",
        image: "/images/clip-24-271052.jpg",
      },
      {
        paper: "הארץ",
        headline: "39 חשודים בתקיפת שוטרים במעברת עמק חפר יובאו לדין",
        sub: "בין הנאשמים נמצאים 8 חיילים",
        image: "/images/clip-9271052.jpg",
      },
      {
        paper: "על המשמר",
        headline: "105 נעצרו במעברת עמק-חפר",
        sub: "המשטרה ערכה סריקה במעברה כדי לאסור את תוקפי השומר",
        image: "/images/clip-3271052.jpg",
      },
    ],
  },
  {
    date: "30.10.1952",
    dateLabel: "30 באוקטובר 1952",
    articles: [
      {
        paper: "העולם הזה",
        headline: "הקרב בעמק חפר",
        sub: "המעברות גועשות! — דיווח מורחב על האירועים במעברת עמק חפר",
        image: "/images/clip-25-301052.jpg",
      },
    ],
  },
  {
    date: "29.10.1952",
    dateLabel: "29 באוקטובר 1952",
    articles: [
      {
        paper: "מעריב",
        headline: "נדונו תושבי מעברת עמק חפר",
        sub: "ראש הממשלה שיגר אמש את מזכירו הצבאי וח״כ ישעיהו למעברת עמק-חפר",
        image: "/images/clip-2291052.jpg",
      },
      {
        paper: "דבר",
        headline: "הממשלה והסוכנות לא ייכנעו ללחץ תושבי המעברות",
        sub: "החיים במעברות חזרו למסלולם התקין",
        image: "/images/clip-5291052.jpg",
      },
      {
        paper: "הארץ",
        headline: "נדונו תושבי מעברת עמק-חפר",
        sub: "23 תושבים נדונו למאסר קצר או קנסות",
        image: "/images/clip-10291052.jpg",
      },
      {
        paper: "הבוקר",
        headline: "מתפרעי מעברת עמק-חפר נדונו למאסר וקנסות",
        sub: "עשרים ושלושה מתושבי המעברה הורשעו בתקיפת שומר ושוטרים",
        image: "/images/clip-14-291052.jpg",
      },
    ],
  },
  {
    date: "03.11.1952",
    dateLabel: "3 בנובמבר 1952",
    articles: [
      {
        paper: "שערים",
        headline: "מה אירע במעברת עמק חפר?",
        sub: "שומר שחצן ואכזר — פזיזות קציני משטרה",
        image: "/images/clip-27-31152.jpg",
      },
    ],
  },
  {
    date: "03.11.1952",
    dateLabel: "3 בנובמבר 1952",
    articles: [
      {
        paper: "הארץ",
        headline: "תושבי מעברת עמק חפר — מכחישים",
        sub: "תושבי המעברה מכחישים את הטענות — סיפרו על יחס השומר הרוכב",
        image: "/images/clip-1131152.jpg",
      },
      {
        paper: "דבר",
        headline: "תושבי מעברת עמק חפר מאשימים את המשטרה שנהגה בחפזון יתר",
        sub: "הוועדה לבדיקת המאורעות: לא היה כל צידוק לרכז כוח משטרתי גדול נגד תושבים הידועים כשלווים ושקטים",
        image: "/images/clip-6-31152.jpg",
      },
      {
        paper: "הדור",
        headline: "פרשת מעברת עמק חפר תובעת חקירה",
        sub: "המעברה בת 1800 נפש — מן השלוות בארץ — המשטרה והשומר הצהירו בביהמ״ש כי בשנה האחרונה לא היו גניבות בפרדסי הסביבה",
        image: "/images/clip-17-31152.jpg",
      },
    ],
  },
  {
    date: "04.11.1952",
    dateLabel: "4 בנובמבר 1952",
    articles: [
      {
        paper: "הארץ",
        headline: "מפקח משטרה על פרשת עמק חפר",
        sub: "׳בשתים שגתה המשטרה בפעולתה במעברת עמק חפר׳",
        image: "/images/clip-1241152.jpg",
      },
      {
        paper: "דבר",
        headline: "עדות המשטרה על התנהגות תושבי מעברת עמק חפר",
        sub: "מפקד מחוז חיפה: 200 שוטרים הובאו בגלל תקיפת השוטרים ולא תקיפת השומר. דובר המשטרה: רואה פגם בעבודת וועדת החקירה שלא גבתה עדויות השוטרים",
        image: "/images/clip-741152.jpg",
      },
      {
        paper: "על המשמר",
        headline: "פרשת מעברת עמק-חפר מוסיפה להכות גלים בארץ",
        sub: "על המשמר מצטרף לתביעת התושבים וחוגים רחבים בארץ להקים ועדת חקירה פרלמנטארית",
        image: "/images/clip-441152.jpg",
      },
      {
        paper: "הבוקר",
        headline: "המשטרה מודה בשגיאתה באי-קיום קשרים הדוקים עם העתונות",
        sub: "מפריכה ספורי אנשי מעברת עמק-חפר",
        image: "/images/clip-15-41152.jpg",
      },
      {
        paper: "קול העם",
        headline: "תושבי מעברת עמק חפר מוקיעים את ההתנהגות האכזרית של המשטרה",
        sub: "מפקח משטרת מחוז חיפה: ׳היה פותח ראשים׳",
        image: "/images/clip-20-41152.jpg",
      },
      {
        paper: "חירות",
        headline: "זה גורלה של המשטרה - קודם הותקפה במעברה ואח״כ - בעתונות",
        sub: "מפקח המשטרה האשים את העתונות בפרסום דברי שקר ואת הועדה בטיפול חד-צדדי",
        image: "/images/clip-2241152.jpg",
      },
      {
        paper: "הצופה",
        headline: "מפקד משטרת מחוז חיפה מכחיש האשמות ועד מעברת עמק חפר",
        sub: "בשתים שגתה המשטרה בפעולתה. המפקח ספקן לגבי טענות העולים אך המשטרה תחקור",
        image: "/images/clip-23-41152.jpg",
      },
      {
        paper: "שערים",
        headline: "המשטרה מזימה את התלונות של ועד מעברת עמק חפר",
        sub: "מפקד מחוז חיפה מגן על התנהלות המשטרה ומפקפק בטענות העולים",
        image: "/images/clip-28-41152.jpg",
      },
      {
        paper: "הדור",
        headline: "המשטרה: לא השתמשנו בכוח במעברת עמק חפר",
        sub: "הצד השני של המטבע - השוטרים הם שהותקפו",
        image: "/images/clip-18-41152.jpg",
      },
    ],
  },
  {
    date: "05.11.1952",
    dateLabel: "5 בנובמבר 1952",
    articles: [
      {
        paper: "קול העם",
        headline: "״הייתי פותח ראשים״",
        sub: "קול העם קובל על פעולות המשטרה ודורש לפטר את הקצין סלע",
        image: "/images/clip-21-51152.jpg",
      },
      {
        paper: "שערים",
        headline: "עשו לנו עוול...",
        sub: "תושבי המעברה מוסיפים להתלונן — ח״כ ישראל ישעיהו מגיש תגובה",
        image: "/images/clip-29-51152.jpg",
      },
      {
        paper: "הבוקר",
        headline: "מפקח המשטרה מכחיש",
        sub: "",
        image: "/images/clip-16-51152.jpg",
      },
    ],
  },
  {
    date: "09.11.1952",
    dateLabel: "9 בנובמבר 1952",
    articles: [
      {
        paper: "שערים",
        headline: "תגובות - חקירה תהיה",
        sub: "פרשת מעברת עמק חפר לא נסתיימה — ועד המעברה ממשיך לפרסם את עדויות התושבים",
        image: "/images/clip-3091152.jpg",
      },
    ],
  },
  {
    date: "07.11.1952",
    dateLabel: "7 בנובמבר 1952",
    articles: [
      {
        paper: "דבר",
        headline: "המועצה האזורית בעמק חפר מגנה את התנהגות תושבי המעברה",
        sub: "אך מזמנת את השומר לבירור. הצד הציבורי בפרשה מעלה שאלות נוקבות על התנהלות המשטרה",
        image: "/images/clip-871152.jpg",
      },
    ],
  },
  {
    date: "13.11.1952",
    dateLabel: "13 בנובמבר 1952",
    articles: [
      {
        paper: "הארץ",
        headline: "מכתבים למערכת:",
        sub: "ח״כ ישעיהו קובע שהמשטרה נקטה פעולות מוגזמות, דורש תשובות על הסיבות להתנהלותה וקובל כנגד אפליית התושבים",
        image: "/images/clip-13-131152.jpg",
      },
    ],
  },
  {
    date: "27.11.1952",
    dateLabel: "27 בנובמבר 1952",
    articles: [
      {
        paper: "העולם הזה",
        headline: "במדינה — עולים: מנגן חדש בתזמורת",
        sub: "תזמורת הקפוח העדתי במדינת ישראל — הפרשה ממשיכה לעניין את הציבור",
        image: "/images/clip-26-271152.jpg",
      },
    ],
  },
  {
    date: "23.11.1952",
    dateLabel: "23 בנובמבר 1952",
    articles: [
      {
        paper: "הדור",
        headline: "י. ישעיהו על המאורעות במעברת עמק חפר",
        sub: "ח״כ ישעיהו ממשיך להתמרמר על המשטרה — לדעתו שהתנהגה שלא כדין",
        image: "/images/clip-19231152.jpg",
      },
    ],
  },
  {
    date: "22.01.2010",
    dateLabel: "22 בינואר 2010",
    articles: [
      {
        paper: "הארץ",
        headline: "במעברת עמק חפר, בשנת 1952, התעורר המרי המזרחי הראשון בישראל, שנקבר בין דפי ההיסטוריה",
        sub: "",
        image: null,
        isHaaretz2010: true,
      },
    ],
  },
];

export default function Timeline() {
  const [expanded, setExpanded] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const toggleExpand = (key) => {
    setExpanded(prev => prev === key ? null : key);
  };

  return (
    <div style={{ padding: "40px 0", borderBottom: "1px solid #ddd", direction: "rtl" }}>
      <h2 style={{ fontFamily: "var(--font-rubik), sans-serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: "700", margin: "0 0 36px", color: "#1a1a1a" }}>
        הכתבות על ציר הזמן
      </h2>

      <div style={{ position: "relative", paddingRight: "32px" }}>
        {/* Vertical line */}
        <div style={{ position: "absolute", right: "8px", top: 0, bottom: 0, width: "2px", background: "#ddd" }} />

        {PRESS_ITEMS.map((item, itemIdx) => (
          <div key={itemIdx} style={{ marginBottom: "36px", position: "relative" }}>
            {/* Dot */}
            <div style={{
              position: "absolute",
              right: "-28px",
              top: "4px",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#1a1a1a",
              border: "3px solid #f7f4ef",
              zIndex: 1,
            }} />

            {/* Date label */}
            <p style={{
              fontSize: "12px", color: "#1a1a1a", margin: "0 0 8px",
              fontFamily: "var(--font-lunasima), sans-serif", letterSpacing: "1px",
              fontWeight: "600",
            }}>
              {item.dateLabel}
            </p>

            {/* Articles */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {item.articles.map((article, artIdx) => {
                const key = `${itemIdx}-${artIdx}`;
                const isOpen = expanded === key;

                return (
                  <div key={artIdx} style={{ border: "1px solid #ddd", background: "#fff", overflow: "hidden" }}>
                    <button
                      onClick={() => toggleExpand(key)}
                      style={{
                        width: "100%", textAlign: "right", background: "transparent",
                        border: "none", cursor: "pointer", padding: "14px 16px",
                        display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px",
                      }}
                    >
                      <div style={{ flex: 1, textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontWeight: "900", fontSize: "18px", fontFamily: "var(--font-rubik), sans-serif", color: "#1a1a1a" }}>
                            {article.paper}
                          </span>
                          <span style={{ fontSize: "11px", color: "#999", fontFamily: "var(--font-lunasima), sans-serif" }}>
                            {item.date}
                          </span>
                        </div>
                        <p style={{ fontFamily: "var(--font-rubik), sans-serif", fontSize: "15px", fontWeight: "500", margin: "0 0 4px", color: "#1a1a1a", lineHeight: "1.3" }}>
                          {article.headline}
                        </p>
                        <p style={{ fontSize: "12px", color: "#777", margin: 0, fontStyle: "italic" }}>
                          {article.sub}
                        </p>
                      </div>
                      <span style={{ fontSize: "18px", color: "#888", flexShrink: 0, marginTop: "2px" }}>
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {isOpen && (
                       <div style={{ borderTop: "1px solid #eee", padding: "16px" }}>
                         {article.isHaaretz2010 ? (
                           <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                             <div style={{ background: "#f7f4ef", border: "1px solid #ddd", overflow: "hidden" }}>
                               <div style={{ padding: "12px 16px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                 <span style={{ fontWeight: "900", fontSize: "14px" }}>הארץ · 22 בינואר 2010</span>
                                 <a href="https://www.haaretz.co.il/misc/2010-01-22/ty-article/0000017f-e98d-d62c-a1ff-fdff8c050000?gift=562668766f4f47e1b966494a68778732" target="_blank" rel="noopener noreferrer"
                                   style={{ padding: "4px 12px", background: "#1a1a1a", color: "#f7f4ef", textDecoration: "none", fontSize: "11px", fontFamily: "var(--font-lunasima), sans-serif" }}>
                                   פתח ↗
                                 </a>
                               </div>
                               <div style={{ maxHeight: "200px", overflow: "hidden", position: "relative" }}>
                                 <iframe src="https://www.haaretz.co.il/misc/2010-01-22/ty-article/0000017f-e98d-d62c-a1ff-fdff8c050000?gift=562668766f4f47e1b966494a68778732" style={{ width: "100%", height: "300px", border: "none", pointerEvents: "none" }} title="כתבת הארץ 2010" />
                                 <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40px", background: "linear-gradient(to bottom, transparent, rgba(247,244,239,0.95))" }} />
                               </div>
                             </div>
                           </div>
                        ) : article.image ? (
                           <div>
                             <img
                               src={article.image}
                               alt={article.headline}
                               onClick={() => setLightbox(article.image)}
                               style={{ width: "100%", maxWidth: "600px", display: "block", margin: "0 auto", cursor: "zoom-in", filter: "grayscale(10%) contrast(1.05)", border: "1px solid #ddd" }}
                             />
                             <p style={{ textAlign: "center", fontSize: "11px", color: "#999", marginTop: "8px", fontStyle: "italic" }}>לחץ להגדלה</p>
                           </div>
                         ) : (
                           <p style={{ color: "#888", fontSize: "13px" }}>אין תמונה זמינה</p>
                         )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px", cursor: "zoom-out" }}
        >
          <img src={lightbox} alt="תצוגה מוגדלת" style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", border: "2px solid #fff" }} />
        </div>
      )}
    </div>
  );
}