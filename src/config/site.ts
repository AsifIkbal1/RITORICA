/**
 * Central company configuration — every page reads contact details from here.
 * Email, phone and website for the Contacts section were supplied by the client; offices are from ritorica.com (client asked to show only the Bangladesh office).
 */
export const site = {
  name: "Ritorica",
  url: "https://www.ritorica.com",
  email: "info@ritorica.com.bd",
  salesEmail: "info@ritorica.com.bd",
  phone: "+880 (180) 599-1950",
  website: "ritorica.com.bd",
  // Bangladesh office — shown where a single address is needed (contact page)
  address: {
    en: "Unit D2, House 26F, Road 20, Sector 3, Uttara, Dhaka, Bangladesh",
    bn: "ইউনিট ডি২, বাড়ি ২৬এফ, রোড ২০, সেক্টর ৩, উত্তরা, ঢাকা, বাংলাদেশ",
  },
  offices: [
    { country: { en: "Bangladesh", bn: "বাংলাদেশ" }, address: { en: "Unit D2, House 26F, Road 20, Sector 3, Uttara, Dhaka, Bangladesh", bn: "ইউনিট ডি২, বাড়ি ২৬এফ, রোড ২০, সেক্টর ৩, উত্তরা, ঢাকা, বাংলাদেশ" } },
  ],
  // PLACEHOLDER — office hours not yet confirmed
  hours: { en: "Sunday – Thursday, 9:00 – 18:00", bn: "রবিবার – বৃহস্পতিবার, সকাল ৯টা – সন্ধ্যা ৬টা" },
  // PLACEHOLDER — add real profile URLs; empty entries are hidden
  social: {
    telegram: "",
    whatsapp: "",
    linkedin: "https://www.linkedin.com/company/ritorica/home/",
  },
  apiHost: "http.ritorica.com",
} as const;
